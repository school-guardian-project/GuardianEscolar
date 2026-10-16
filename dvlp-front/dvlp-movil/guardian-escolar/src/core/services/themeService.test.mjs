import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import ts from 'typescript';

const THEME_KEY = '@guardian_escolar_theme';

/**
 * Compila un archivo con TypeScript para poder evaluarlo en Node.
 *
 * ThemeService.js es JSX y este repositorio no tiene un renderer (ni jest ni
 * React Native Testing Library), asi que el archivo se compila con TypeScript
 * —que ya es devDependency del proyecto— y se evalua en un contexto aislado.
 */
function transpile(url) {
  return ts.transpileModule(readFileSync(url, 'utf8'), {
    fileName: 'module.js',
    compilerOptions: { jsx: 'react-jsx', target: 'es2022', module: 'esnext' },
  }).outputText;
}

/**
 * Monta ThemeService.js fuera de React, con dobles minimos de `react` y de
 * AsyncStorage.
 *
 * Se prueba la logica del proveedor: que tema carga, cuando lo persiste y como
 * compone los nombres light/dark. El renderizado en si no es lo que se valida
 * (React no esta de por medio), por eso el doble de `react` solo implementa
 * `useState`, `useEffect`, `useContext` y `createContext`.
 *
 * El doble ejecuta los efectos a mano: `render()` vuelve a ejecutar el
 * proveedor y `settle()` corre los efectos pendientes y deja pasar las
 * promesas antes de volver a renderizar. Con eso se reproduce el ciclo
 * cargar -> setState -> re-render.
 */
async function createThemeHarness({
  savedTheme = null,
  failGet = false,
  failSet = false,
} = {}) {
  const reads = [];
  const writes = [];
  const hooks = [];
  const pendingEffects = [];
  let cursor = 0;
  let providerValue = null;

  const context = createContext({ console: { log() {} } });

  const React = {
    createContext(defaultValue) {
      return { defaultValue, Provider: { isProvider: true } };
    },
    useContext(ctx) {
      return ctx.__value;
    },
    useState(initial) {
      const index = cursor;
      cursor += 1;

      if (!hooks[index]) {
        hooks[index] = { value: initial };
      }

      const hook = hooks[index];

      return [
        hook.value,
        (next) => {
          const value = typeof next === 'function' ? next(hook.value) : next;
          hook.value = value;
        },
      ];
    },
    useEffect(effect, deps) {
      const index = cursor;
      cursor += 1;

      const previous = hooks[index];
      const sameDeps =
        previous &&
        deps &&
        previous.deps &&
        previous.deps.length === deps.length &&
        previous.deps.every((dep, i) => Object.is(dep, deps[i]));

      if (sameDeps) {
        return;
      }

      hooks[index] = { deps };
      pendingEffects.push(effect);
    },
  };

  const reactModule = new SyntheticModule(
    ['default', 'useState', 'useEffect', 'useContext', 'createContext'],
    function () {
      this.setExport('default', React);

      for (const name of ['useState', 'useEffect', 'useContext', 'createContext']) {
        this.setExport(name, React[name]);
      }
    },
    { context },
  );

  // babel/TypeScript emiten el JSX como `react/jsx-runtime`.
  const jsxRuntimeModule = new SyntheticModule(
    ['jsx', 'jsxs', 'Fragment'],
    function () {
      const jsx = (type, props) => ({ type, props });

      this.setExport('jsx', jsx);
      this.setExport('jsxs', jsx);
      this.setExport('Fragment', Symbol('Fragment'));
    },
    { context },
  );

  const asyncStorageModule = new SyntheticModule(
    ['default'],
    function () {
      this.setExport('default', {
        async getItem(key) {
          reads.push(key);

          if (failGet) {
            throw new Error('almacenamiento no disponible');
          }

          return savedTheme;
        },
        async setItem(key, value) {
          writes.push({ key, value });

          if (failSet) {
            throw new Error('almacenamiento no disponible');
          }
        },
      });
    },
    { context },
  );

  // Colors.js es el catalogo real: el test no lo duplica.
  const colorsModule = new SourceTextModule(
    transpile(new URL('../constants/Colors.js', import.meta.url)),
    { context },
  );
  await colorsModule.link(() => {
    throw new Error('Colors.js no deberia importar nada');
  });
  await colorsModule.evaluate();

  const serviceModule = new SourceTextModule(
    transpile(new URL('./ThemeService.js', import.meta.url)),
    { context },
  );
  await serviceModule.link((specifier) => {
    if (specifier === 'react') return reactModule;
    if (specifier === 'react/jsx-runtime') return jsxRuntimeModule;
    if (specifier === '@react-native-async-storage/async-storage') return asyncStorageModule;
    if (specifier === '../constants/Colors') return colorsModule;

    throw new Error(`import inesperado: ${specifier}`);
  });
  await serviceModule.evaluate();

  const tick = () => new Promise((resolve) => setImmediate(resolve));

  function render() {
    cursor = 0;

    const element = serviceModule.namespace.ThemeProvider({ children: 'contenido' });
    providerValue = element ? element.props.value : null;

    return providerValue;
  }

  async function settle() {
    // 6 pasadas sobran: el unico efecto es la carga inicial.
    for (let pass = 0; pass < 6; pass += 1) {
      const effects = pendingEffects.splice(0, pendingEffects.length);

      for (const effect of effects) {
        effect();
      }

      await tick();
      render();
    }

    return providerValue;
  }

  return {
    render,
    settle,
    value: () => providerValue,
    reads,
    writes,
    themes: colorsModule.namespace.themes,
    defaultTheme: colorsModule.namespace.defaultTheme,
    async mount() {
      render();
      return settle();
    },
  };
}

test('no publica ningun tema hasta terminar de leer el guardado', async () => {
  const harness = await createThemeHarness();

  // Primer render: el efecto de carga todavia no corrio.
  assert.equal(harness.render(), null);

  await harness.settle();
  assert.notEqual(harness.value(), null);
});

test('sin tema guardado arranca con el tema por defecto', async () => {
  const harness = await createThemeHarness();

  const theme = await harness.mount();

  assert.equal(theme.themeName, harness.defaultTheme);
  assert.equal(theme.theme, harness.themes[harness.defaultTheme]);
  assert.equal(theme.isDark, false);
  assert.deepEqual(harness.reads, [THEME_KEY]);
  assert.deepEqual(harness.writes, []);
});

test('restaura el tema guardado y no lo vuelve a escribir', async () => {
  const harness = await createThemeHarness({ savedTheme: 'darkGreen' });

  const theme = await harness.mount();

  assert.equal(theme.themeName, 'darkGreen');
  assert.equal(theme.theme, harness.themes.darkGreen);
  assert.equal(theme.isDark, true);
  assert.deepEqual(harness.writes, []);
});

test('ignora un tema guardado que ya no existe en el catalogo', async () => {
  const harness = await createThemeHarness({ savedTheme: 'lightPink' });

  const theme = await harness.mount();

  assert.equal(theme.themeName, harness.defaultTheme);
});

test('changeTheme cambia el tema y lo deja guardado', async () => {
  const harness = await createThemeHarness();

  await harness.mount();
  await harness.value().changeTheme('darkRed');
  harness.render();

  assert.equal(harness.value().themeName, 'darkRed');
  assert.equal(harness.value().isDark, true);
  assert.deepEqual(harness.writes, [{ key: THEME_KEY, value: 'darkRed' }]);
});

test('changeTheme ignora un tema que no existe', async () => {
  const harness = await createThemeHarness();

  await harness.mount();
  await harness.value().changeTheme('lightPink');
  harness.render();

  assert.equal(harness.value().themeName, harness.defaultTheme);
  assert.deepEqual(harness.writes, []);
});

test('changeColor cambia el color y conserva claro/oscuro', async () => {
  const harness = await createThemeHarness();

  await harness.mount();

  await harness.value().changeColor('green');
  harness.render();
  assert.equal(harness.value().themeName, 'lightGreen');

  await harness.value().changeColor('red');
  harness.render();
  assert.equal(harness.value().themeName, 'lightRed');

  await harness.value().changeTheme('darkBlue');
  harness.render();

  await harness.value().changeColor('yellow');
  harness.render();
  assert.equal(harness.value().themeName, 'darkYellow');

  assert.deepEqual(harness.writes, [
    { key: THEME_KEY, value: 'lightGreen' },
    { key: THEME_KEY, value: 'lightRed' },
    { key: THEME_KEY, value: 'darkBlue' },
    { key: THEME_KEY, value: 'darkYellow' },
  ]);
});

test('toggleTheme invierte claro/oscuro conservando el color', async () => {
  const harness = await createThemeHarness();

  await harness.mount();

  await harness.value().changeTheme('lightGreen');
  harness.render();

  await harness.value().toggleTheme();
  harness.render();
  assert.equal(harness.value().themeName, 'darkGreen');
  assert.equal(harness.value().isDark, true);

  await harness.value().toggleTheme();
  harness.render();
  assert.equal(harness.value().themeName, 'lightGreen');
  assert.equal(harness.value().isDark, false);
});

test('si no se puede leer el tema guardado igual arranca con el por defecto', async () => {
  const harness = await createThemeHarness({ failGet: true });

  const theme = await harness.mount();

  assert.equal(theme.themeName, harness.defaultTheme);
});

test('si no se puede guardar, el tema cambia igual en memoria', async () => {
  const harness = await createThemeHarness({ failSet: true });

  await harness.mount();
  await harness.value().changeTheme('darkYellow');
  harness.render();

  assert.equal(harness.value().themeName, 'darkYellow');
  assert.deepEqual(harness.writes, [{ key: THEME_KEY, value: 'darkYellow' }]);
});

test('el catalogo sigue la convencion claro/oscuro + color que compone ThemeService', async () => {
  const harness = await createThemeHarness();
  const names = [...Object.keys(harness.themes)];

  assert.equal(names.length, 8);

  for (const name of names) {
    assert.match(name, /^(light|dark)(Blue|Green|Red|Yellow)$/);
  }

  assert.ok(names.includes(harness.defaultTheme));

  // toggleTheme y changeColor solo saben construir estos cuatro colores.
  for (const color of ['Blue', 'Green', 'Red', 'Yellow']) {
    assert.ok(names.includes(`light${color}`));
    assert.ok(names.includes(`dark${color}`));
  }
});
