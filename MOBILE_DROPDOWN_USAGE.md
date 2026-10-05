# Ejemplo de Uso: Dropdown en Mobile (React Native)

## Componente Dropdown

El componente `Dropdown` es un selector reutilizable para React Native que carga opciones desde el backend.

### Importar el componente

```javascript
import Dropdown from "@components/inputs/Dropdown";
```

### Ejemplo 1: Dropdown simple de Campuses

```javascript
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Dropdown from "@components/inputs/Dropdown";
import * as campusesService from "@core/services/campusesService";
import * as authService from "@core/services/authService";

export default function CampusForm() {
  const [campusId, setCampusId] = useState(null);

  const loadCampuses = async () => {
    const session = await authService.getSession();
    if (!session?.campusId) return [];
    
    const campuses = await campusesService.listCampuses(session.campusId);
    return campuses.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  };

  return (
    <View style={styles.container}>
      <Dropdown
        label="Campus"
        value={campusId}
        onSelect={setCampusId}
        loadOptions={loadCampuses}
        placeholder="Selecciona un campus"
        required={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### Ejemplo 2: Dropdowns en cascada (Brand → Model)

```javascript
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Dropdown from "@components/inputs/Dropdown";
import * as vehicleTypesService from "@core/services/vehicleTypesService";

export default function VehicleForm() {
  const [brandId, setBrandId] = useState(null);
  const [modelId, setModelId] = useState(null);

  const loadBrands = async () => {
    const brands = await vehicleTypesService.listBrands();
    return brands.map((b) => ({
      value: b.id,
      label: b.name,
    }));
  };

  const loadModels = async () => {
    if (!brandId) return [];
    
    const models = await vehicleTypesService.listModels(brandId);
    return models.map((m) => ({
      value: m.id,
      label: m.name,
    }));
  };

  function handleBrandSelect(id) {
    setBrandId(id);
    setModelId(null); // Reset model cuando cambia la marca
  }

  return (
    <View style={styles.container}>
      <Dropdown
        label="Marca"
        value={brandId}
        onSelect={handleBrandSelect}
        loadOptions={loadBrands}
        placeholder="Selecciona una marca"
        required={true}
      />

      {brandId && (
        <Dropdown
          label="Modelo"
          value={modelId}
          onSelect={setModelId}
          loadOptions={loadModels}
          placeholder="Selecciona un modelo"
          required={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### Ejemplo 3: Formulario completo de Bus

```javascript
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Dropdown from "@components/inputs/Dropdown";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import * as campusesService from "@core/services/campusesService";
import * as vehicleTypesService from "@core/services/vehicleTypesService";
import * as authService from "@core/services/authService";

export default function BusForm() {
  const [campusId, setCampusId] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");

  const loadCampuses = async () => {
    const session = await authService.getSession();
    if (!session?.campusId) return [];
    
    const campuses = await campusesService.listCampuses(session.campusId);
    return campuses.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  };

  const loadBrands = async () => {
    const brands = await vehicleTypesService.listBrands();
    return brands.map((b) => ({
      value: b.id,
      label: b.name,
    }));
  };

  const loadModels = async () => {
    if (!brandId) return [];
    
    const models = await vehicleTypesService.listModels(brandId);
    return models.map((m) => ({
      value: m.id,
      label: m.name,
    }));
  };

  function handleBrandSelect(id) {
    setBrandId(id);
    setModelId(null);
  }

  async function handleSubmit() {
    // Validación
    if (!campusId || !brandId || !modelId || !plate || !capacity) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const busData = {
      campuseId: campusId,
      modelId: modelId,
      plate: plate.toUpperCase(),
      capacity: parseInt(capacity, 10),
      // ... otros campos
    };

    try {
      // await busesService.create(busData);
      Alert.alert("Éxito", "Bus creado correctamente");
      // Reset form
      setCampusId(null);
      setBrandId(null);
      setModelId(null);
      setPlate("");
      setCapacity("");
    } catch (error) {
      Alert.alert("Error", error.message || "Error al crear el bus");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Bus</Text>

      <Dropdown
        label="Campus"
        value={campusId}
        onSelect={setCampusId}
        loadOptions={loadCampuses}
        placeholder="Selecciona un campus"
        required={true}
      />

      <Dropdown
        label="Marca"
        value={brandId}
        onSelect={handleBrandSelect}
        loadOptions={loadBrands}
        placeholder="Selecciona una marca"
        required={true}
      />

      {brandId && (
        <Dropdown
          label="Modelo"
          value={modelId}
          onSelect={setModelId}
          loadOptions={loadModels}
          placeholder="Selecciona un modelo"
          required={true}
        />
      )}

      <InputField
        label="Placa"
        value={plate}
        onChangeText={setPlate}
        placeholder="ABC123"
        autoCapitalize="characters"
      />

      <InputField
        label="Capacidad"
        value={capacity}
        onChangeText={setCapacity}
        placeholder="45"
        keyboardType="number-pad"
      />

      <PrimaryButton title="Guardar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
});
```

## API del componente Dropdown

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `label` | `string` | No | Etiqueta del dropdown |
| `value` | `any` | Sí | Valor seleccionado |
| `onSelect` | `function` | Sí | Callback cuando se selecciona una opción |
| `loadOptions` | `function` | Sí | Función async que retorna array de `{value, label}` |
| `placeholder` | `string` | No | Texto placeholder (default: "Seleccionar...") |
| `required` | `boolean` | No | Muestra asterisco rojo si es true |
| `error` | `string` | No | Mensaje de error para mostrar |

### Interfaz de opción

```javascript
{
  value: string | number,
  label: string
}
```

## Servicios disponibles

### profileService
```javascript
import * as profileService from "@core/services/profileService";

// Obtener perfil del usuario autenticado
const profile = await profileService.getProfile();
// Returns: { profileId, personId, email, roleId, roleName, campusId }
```

### campusesService
```javascript
import * as campusesService from "@core/services/campusesService";

// Listar campuses de una escuela
const campuses = await campusesService.listCampuses(schoolId);
// Returns: [{ id, name, address }, ...]
```

### vehicleTypesService
```javascript
import * as vehicleTypesService from "@core/services/vehicleTypesService";

// Listar marcas
const brands = await vehicleTypesService.listBrands();
// Returns: [{ id, name }, ...]

// Listar modelos (opcionalmente filtrados por marca)
const models = await vehicleTypesService.listModels(brandId);
// Returns: [{ id, name, brandId, brandName }, ...]
```

### apiClient
```javascript
import { apiGet, apiPost, apiPut, apiDelete } from "@core/services/apiClient";

// GET request con token automático
const data = await apiGet("/api/v1/auth/profile");

// POST request
const result = await apiPost("/fleet/api/buses", { plate: "ABC123" });

// PUT request
await apiPut("/fleet/api/buses/123", { plate: "XYZ789" });

// DELETE request
await apiDelete("/fleet/api/buses/123");
```

## Patrones recomendados

### 1. Dropdowns en cascada
Cuando tengas dropdowns dependientes (Brand → Model), resetea el valor del dropdown hijo cuando cambie el padre:

```javascript
function handleBrandSelect(id) {
  setBrandId(id);
  setModelId(null); // Reset model
}
```

### 2. Validación
Valida que todos los campos requeridos estén completos antes de enviar:

```javascript
if (!campusId || !brandId || !modelId) {
  Alert.alert("Error", "Completa todos los campos");
  return;
}
```

### 3. Manejo de errores
Envuelve las llamadas en try-catch y muestra errores al usuario:

```javascript
try {
  await busesService.create(busData);
  Alert.alert("Éxito", "Bus creado");
} catch (error) {
  Alert.alert("Error", error.message);
}
```

### 4. Carga condicional
Solo muestra dropdowns hijos cuando el padre tenga valor:

```javascript
{brandId && (
  <Dropdown
    label="Modelo"
    value={modelId}
    onSelect={setModelId}
    loadOptions={loadModels}
  />
)}
```

## Endpoints Backend

### Auth
```
GET /api/v1/auth/profile
Headers: Authorization: Bearer <token>
Response: { profileId, personId, email, roleId, roleName, campusId }
```

### Campuses
```
GET /school-management/api/v1/schools/{schoolId}/campuses
Response: [{ id, name, address }, ...]
```

### Vehicle Types
```
GET /fleet/api/vehicle-types/brands
Response: [{ id, name }, ...]

GET /fleet/api/vehicle-types/models?brandId={brandId}
Response: [{ id, name, brandId, brandName }, ...]
```

## Testing

```javascript
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Dropdown from "./Dropdown";

describe("Dropdown", () => {
  it("loads and displays options", async () => {
    const loadOptions = jest.fn().mockResolvedValue([
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ]);

    const { getByText } = render(
      <Dropdown label="Test" value={null} onSelect={() => {}} loadOptions={loadOptions} />
    );

    await waitFor(() => {
      expect(getByText("Test")).toBeTruthy();
    });
  });
});
```
