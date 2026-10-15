#!/bin/bash
# Verifica que cada ruta que consume el frontend responde a traves de Kong.
# Uso: ./scripts/verify-api.sh
# Env: API_URL (default http://localhost:8000)

API="${API_URL:-http://localhost:8000}"
PASS=0; FAIL=0
declare -a ROWS

login() {
  curl -s -X POST "$API/api/v1/auth/login" -H 'Content-Type: application/json' \
    -d "{\"email\":\"$1\",\"password\":\"$2\"}" | jq -r '.accessToken // empty'
}

# code <descripcion> <metodo> <ruta> <token> <esperado> [body]
code() {
  local desc="$1" method="$2" path="$3" token="$4" expected="$5" body="$6"
  local args=(-s -o /dev/null -w '%{http_code}' -X "$method" "$API$path")
  [ -n "$token" ] && args+=(-H "Authorization: Bearer $token")
  # Un POST sin body lo rechaza ms-iam con 403 antes de llegar al controlador, asi
  # que las pruebas de escritura siempre mandan un objeto JSON.
  [ -n "$body" ] && args+=(-H 'Content-Type: application/json' -d "$body")
  local got
  got=$(curl "${args[@]}")
  local mark="OK "
  if [ "$got" = "$expected" ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); mark="FAIL"; fi
  printf "  [%s] %-46s %-6s -> %s (esperado %s)\n" "$mark" "$desc" "$method" "$got" "$expected"
}

echo "=============================================================="
echo " Verificacion de rutas frontend -> Kong -> microservicios"
echo " API: $API"
echo "=============================================================="

ADMIN=$(login admin@school-guardian.com 99000000001)
STUDENT=$(login student@school-guardian.com 99000000004)
DRIVER=$(login driver@school-guardian.com 99000000002)
PARENT=$(login parent@school-guardian.com 99000000003)

echo
echo "-- ms-iam (sin token / con token) --"
code "login sin credenciales validas"   POST "/api/v1/auth/login" "" 401 '{"email":"nadie@school-guardian.com","password":"incorrecta"}'
code "login admin"                      POST "/api/v1/auth/login" "" 200 '{"email":"admin@school-guardian.com","password":"99000000001"}'
code "perfil sin token (debe ser 401)"  GET  "/api/v1/auth/profile" "" 401
code "perfil con token admin"           GET  "/api/v1/auth/profile" "$ADMIN" 200
code "perfil con token student"         GET  "/api/v1/auth/profile" "$STUDENT" 200
code "perfil con token driver"          GET  "/api/v1/auth/profile" "$DRIVER" 200
code "perfil con token parent"          GET  "/api/v1/auth/profile" "$PARENT" 200
# El movil manda el refresh token en Authorization: Bearer (no usa la cookie
# HttpOnly). Antes el filtro JWT lo interpretaba como access token y el refresh
# moria con 401 antes de llegar al controlador.
RT=$(curl -s -X POST "$API/api/v1/auth/login" -H 'Content-Type: application/json' \
  -d '{"email":"student@school-guardian.com","password":"99000000004"}' | jq -r '.refreshToken // empty')
code "refresh por header (movil)"        POST "/api/v1/auth/refresh" "$RT" 200
code "refresh con token invalido"        POST "/api/v1/auth/refresh" "no.es.un.token" 401

echo
echo "-- ms-school-management --"
code "listar colegios"                  GET  "/school-management/api/v1/schools" "$ADMIN" 200
code "buscar colegios"                  GET  "/school-management/api/v1/schools/search?search=a" "$ADMIN" 200
SCHOOL=$(curl -s "$API/school-management/api/v1/schools" -H "Authorization: Bearer $ADMIN" | jq -r '.[0].id // empty')
code "colegio por id"                   GET  "/school-management/api/v1/schools/$SCHOOL" "$ADMIN" 200
code "listar sedes de colegio"          GET  "/school-management/api/v1/schools/$SCHOOL/campuses" "$ADMIN" 200
code "sedes de colegio inexistente"     GET  "/school-management/api/v1/schools/00000000-0000-0000-0000-000000000000/campuses" "$ADMIN" 200

echo
echo "-- ms-school-management: alta de colegio con sedes --"
# La ciudad se toma de la primera del catalogo: es un seed estable y el endpoint
# de ciudades responde por Kong.
CITY=$(curl -s "$API/route/api/cities" -H "Authorization: Bearer $ADMIN" | jq -r '.[0].id // empty')
SCHOOL_BODY="{\"cityId\":\"$CITY\",\"logo\":\"\",\"name\":\"Colegio Verify Script\",\"address\":\"Calle 1 #2-3\",\"phone\":6050000,\"email\":\"verify@colegio.com\",\"campuses\":[{\"name\":\"Sede Verify 1\",\"address\":\"Calle 1 #2-3\"},{\"name\":\"Sede Verify 2\",\"address\":\"Calle 4 #5-6\"}]}"
code "alta colegio con sedes (201)"      POST "/school-management/api/v1/schools/with-campuses" "$ADMIN" 201 "$SCHOOL_BODY"
code "alta colegio sin sedes (201)"      POST "/school-management/api/v1/schools/with-campuses" "$ADMIN" 201 "{\"cityId\":\"$CITY\",\"logo\":\"\",\"name\":\"Colegio Verify Sin Sedes\",\"address\":\"Calle 1 #2-3\",\"phone\":6050001,\"email\":\"verify-sin-sedes@colegio.com\",\"campuses\":[]}"
code "alta colegio con sedes repetidas" POST "/school-management/api/v1/schools/with-campuses" "$ADMIN" 409 "{\"cityId\":\"$CITY\",\"logo\":\"\",\"name\":\"Colegio Verify Duplicado\",\"address\":\"Calle 1 #2-3\",\"phone\":6050002,\"email\":\"verify-duplicado@colegio.com\",\"campuses\":[{\"name\":\"Sede A\",\"address\":\"Calle 1 #2-3\"},{\"name\":\"sede a\",\"address\":\"Calle 4 #5-6\"}]}"

echo
echo "-- ms-user-management --"
for r in students drivers parents families admins; do
  code "listar $r"                      GET  "/user/api/$r" "$ADMIN" 200
  code "buscar $r"                      GET  "/user/api/$r/search?search=a" "$ADMIN" 200
done

echo
echo "-- ms-user-management: altas con colegio/sede --"
# campusId y schoolId son obligatorios y se validan por gRPC contra
# ms-school-management. Un id con forma de UUID pero inexistente debe ser 400
# ("no existe"), nunca 200: si se aceptara, quedaria una persona registrada en
# una sede que no existe.
CAMPUS=$(curl -s "$API/school-management/api/v1/schools/$SCHOOL/campuses" -H "Authorization: Bearer $ADMIN" | jq -r '.[0].id // empty')
GHOST=00000000-0000-0000-0000-00000000dead
PERSON='{"name":"Verify","lastName":"Script","identificationType":"CC","identificationNumber":"99000000999","email":"verify-script@x.com","phone":1,"residenceAddress":"x","dateBirth":"2012-01-01"'
code "alta student sin campusId (400)"     POST "/user/api/students" "$ADMIN" 400 "$PERSON}"
code "alta student con campusId fantasma"  POST "/user/api/students" "$ADMIN" 400 "$PERSON,\"campusId\":\"$GHOST\"}"
code "alta student con campusId valido"    POST "/user/api/students" "$ADMIN" 200 "$PERSON,\"campusId\":\"$CAMPUS\"}"
code "alta driver sin campusId (400)"      POST "/user/api/drivers"  "$ADMIN" 400 "$PERSON}"
code "alta parent sin campusId (400)"      POST "/user/api/parents"  "$ADMIN" 400 "$PERSON}"
code "alta admin sin schoolId (400)"       POST "/user/api/admins"   "$ADMIN" 400 "$PERSON}"
code "alta admin con schoolId fantasma"    POST "/user/api/admins"   "$ADMIN" 400 "$PERSON,\"schoolId\":\"$GHOST\"}"

echo
echo "-- ms-route --"
code "listar rutas"                     GET  "/route/api/routes" "$ADMIN" 200
code "buscar rutas"                     GET  "/route/api/routes/search?search=a" "$ADMIN" 200
code "listar paradas"                   GET  "/route/api/stops" "$ADMIN" 200
code "buscar paradas"                   GET  "/route/api/stops/search?search=a" "$ADMIN" 200
code "listar ciudades"                  GET  "/route/api/cities" "$ADMIN" 200
code "ruta de estudiante"               GET  "/route/api/routes/student/C1000039-0000-4000-8000-000000000039" "$STUDENT" 200
code "ruta de estudiante sin asignar"   GET  "/route/api/routes/student/00000000-0000-4000-8000-0000000000ff" "$STUDENT" 404

echo
echo "-- ms-fleet --"
code "listar buses"                     GET  "/fleet/api/buses" "$ADMIN" 200
code "buscar buses"                     GET  "/fleet/api/buses/search?search=a" "$ADMIN" 200
code "marcas de vehiculo"               GET  "/fleet/api/vehicle-types/brands" "$ADMIN" 200
BRAND=$(curl -s "$API/fleet/api/vehicle-types/brands" -H "Authorization: Bearer $ADMIN" | jq -r '.[0].id // empty')
code "modelos por marca"                GET  "/fleet/api/vehicle-types/models?brandId=$BRAND" "$ADMIN" 200

echo
echo "-- ms-notification --"
code "notifications de guardian"        GET  "/notification/api/v1/notifications/guardian/00000000-0000-0000-0000-000000000000" "$PARENT" 200

echo
echo "-- servicios sin ruta en Kong (deben dar 404) --"
code "ms-exceptional driver-usages"     GET  "/exceptional/api/driver-usages" "$ADMIN" 404
code "ms-configuration settings"        GET  "/configuration/api/settings" "$ADMIN" 404

echo
echo "=============================================================="
echo " OK: $PASS    FAIL: $FAIL"
echo "=============================================================="
[ "$FAIL" -eq 0 ]
