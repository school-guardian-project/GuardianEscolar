import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import Dropdown from "@components/inputs/Dropdown";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import * as campusesService from "@core/services/campusesService";
import * as vehicleTypesService from "@core/services/vehicleTypesService";
import * as busesService from "@core/services/busesService";
import * as authService from "@core/services/authService";

/**
 * Formulario de registro de bus conectado al backend (POST /fleet/api/buses).
 * Usa los dropdowns en cascada con datos reales de ms-school-management y ms-fleet.
 */
export default function BusFormExample() {
  const [campusId, setCampusId] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [soatValidity, setSoatValidity] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar campuses desde el backend
  const loadCampuses = async () => {
    try {
      const session = await authService.getSession();
      // Por ahora usamos campusId como schoolId (ajustar según lógica de negocio)
      const schoolId = session?.campusId;
      
      if (!schoolId) {
        console.warn("No schoolId found in session");
        return [];
      }
      
      const campuses = await campusesService.listCampuses(schoolId);
      return campuses.map((c) => ({
        value: c.id,
        label: c.name,
      }));
    } catch (error) {
      console.error("Error loading campuses:", error);
      return [];
    }
  };

  // Cargar marcas desde el backend
  const loadBrands = async () => {
    try {
      const brands = await vehicleTypesService.listBrands();
      return brands.map((b) => ({
        value: b.id,
        label: b.name,
      }));
    } catch (error) {
      console.error("Error loading brands:", error);
      return [];
    }
  };

  // Cargar modelos filtrados por marca
  const loadModels = async () => {
    try {
      if (!brandId) return [];
      
      const models = await vehicleTypesService.listModels(brandId);
      return models.map((m) => ({
        value: m.id,
        label: m.name,
      }));
    } catch (error) {
      console.error("Error loading models:", error);
      return [];
    }
  };

  // Resetear modelo cuando cambia la marca
  function handleBrandSelect(id) {
    setBrandId(id);
    setModelId(null);
  }

  // Validar y enviar formulario
  async function handleSubmit() {
    // Validación
    if (!campusId || !brandId || !modelId || !plate || !capacity || !soatValidity) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (plate.length < 3) {
      Alert.alert("Error", "La placa debe tener al menos 3 caracteres");
      return;
    }

    const capacityNum = parseInt(capacity, 10);
    if (isNaN(capacityNum) || capacityNum < 1 || capacityNum > 100) {
      Alert.alert("Error", "La capacidad debe estar entre 1 y 100");
      return;
    }

    // El backend espera una fecha ISO (aaaa-mm-dd)
    const soat = new Date(soatValidity);
    if (isNaN(soat.getTime())) {
      Alert.alert("Error", "La fecha de vencimiento del SOAT no es válida (usa aaaa-mm-dd)");
      return;
    }
    const soatISO = soat.toISOString().slice(0, 10);

    setLoading(true);

    try {
      // Contrato real de ms-fleet: gpsDeviceId y status no viajan en el POST
      // (el backend los fija/valida; ver busesService.createBus).
      const busData = {
        campuseId: campusId,
        modelId: modelId,
        plate: plate.toUpperCase(),
        capacity: capacityNum,
        soatValidity: soatISO,
      };

      const busId = await busesService.createBus(busData);

      Alert.alert("Éxito", `Bus registrado correctamente (id: ${busId})`);

      // Reset form
      setCampusId(null);
      setBrandId(null);
      setModelId(null);
      setPlate("");
      setCapacity("");
      setSoatValidity("");
    } catch (error) {
      const detail = error.data?.message ? `\n${error.data.message}` : "";
      Alert.alert("Error", `${error.message || "Error al registrar el bus"}${detail}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registrar Bus</Text>
      <Text style={styles.subtitle}>
        Este es un ejemplo de formulario con dropdowns conectados al backend
      </Text>

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

      <InputField
        label="Vencimiento SOAT"
        value={soatValidity}
        onChangeText={setSoatValidity}
        placeholder="2027-01-01"
        autoCapitalize="none"
      />

      <PrimaryButton
        title={loading ? "Guardando..." : "Guardar Bus"}
        onPress={handleSubmit}
        disabled={loading}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Información:</Text>
        <Text style={styles.infoText}>
          • Los dropdowns cargan datos del backend{"\n"}
          • Marca y Modelo son dropdowns en cascada{"\n"}
          • Los datos se validan antes de enviar{"\n"}
          • El token JWT se envía automáticamente (con refresh)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 20,
  },
});
