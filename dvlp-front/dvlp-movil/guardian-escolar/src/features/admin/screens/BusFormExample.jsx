import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import Dropdown from "@components/inputs/Dropdown";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import * as campusesService from "@core/services/campusesService";
import * as vehicleTypesService from "@core/services/vehicleTypesService";
import * as authService from "@core/services/authService";

/**
 * Ejemplo de formulario con dropdowns en cascada
 * Este componente demuestra el uso de los dropdowns con datos del backend
 */
export default function BusFormExample() {
  const [campusId, setCampusId] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
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
    if (!campusId || !brandId || !modelId || !plate || !capacity) {
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

    setLoading(true);

    try {
      const busData = {
        campuseId: campusId,
        modelId: modelId,
        plate: plate.toUpperCase(),
        capacity: capacityNum,
        soatValidity: new Date().toISOString(), // Placeholder
        gpsDeviceId: "00000000-0000-0000-0000-000000000000", // Placeholder
        status: "Active",
      };

      // TODO: Integrar con busesService cuando esté implementado en mobile
      // await busesService.create(busData);
      
      console.log("Bus data to create:", busData);
      
      Alert.alert("Éxito", "Bus registrado correctamente (simulado)");
      
      // Reset form
      setCampusId(null);
      setBrandId(null);
      setModelId(null);
      setPlate("");
      setCapacity("");
    } catch (error) {
      Alert.alert("Error", error.message || "Error al registrar el bus");
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
          • El token JWT se envía automáticamente
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
