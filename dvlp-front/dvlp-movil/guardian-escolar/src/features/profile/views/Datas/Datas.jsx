import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useSession from "@core/hooks/useSession";
import { API_CONFIG } from "@core/api/api.config";
import { personService, schoolService } from "@core/api/services";

export default function Datas() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userId, session } = useSession();
  const [person, setPerson] = useState(null);
  const [school, setSchool] = useState(null);

  const load = async () => {
    if (!API_CONFIG.ENABLED) return;
    try {
      if (session?.person) {
        const p = session.person;
        const persons = await personService.query({ Email: p.email });
        if (persons[0]) setPerson(persons[0]);
        else setPerson({ ...p, Phone: '3000000000', ResidenceAddress: 'Calle', Email: p.email });
        const schools = await schoolService.list();
        if (schools[0]) setSchool(schools[0]);
        return;
      }
      const emailMap = { 'mock-student-1': 'estudiante1@guardianescolar.demo', 'mock-driver-1': 'admin1@colegio.edu.co', 'mock-father-1': 'admin2@colegio.edu.co' };
      const email = emailMap[userId] || 'estudiante1@guardianescolar.demo';
      const persons = await personService.query({ Email: email });
      const p = persons[0];
      if (p) {
        setPerson(p);
        const schools = await schoolService.list();
        if (schools[0]) setSchool(schools[0]);
      }
    } catch (e) {
      console.warn('[Datas] API fallo', e.message);
    }
  };

  useEffect(() => { load(); }, [userId, session]);
  useFocusEffect(React.useCallback(() => { load(); }, [userId, session]));
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bgColor },
      ]}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <BackButton label={t("inputs.data")} />
      </View>

      {/* Contenido */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InfoCard>
          <InfoRow
            icon="call-outline"
            title={t("inputs.phone")}
            value={person ? `+57 ${person.Phone}` : '+57 *** *** ****'}
            editable
            editOnPress={() => navigation.navigate("UpdatePhone")}
          />

          <InfoRow
            icon="mail-outline"
            title={t("inputs.email")}
            value={person?.Email ?? 'correoejemplo@gmail.com'}
            editable
            editOnPress={() => navigation.navigate("UpdateEmail")}
          />

          <InfoRow
            icon="lock-closed-outline"
            title={t("inputs.password")}
            value="••••••••••••"
            hidden
            last
          />
        </InfoCard>

        <InfoCard>
          <InfoRow
            icon="location-outline"
            title={t("inputs.address")}
            value={person?.ResidenceAddress ?? 'Calle 2 #1W-102'}
            arrow
          />

          <InfoRow
            icon="business-outline"
            title={t("inputs.city")}
            value="Neiva"
            arrow
            last
          />
        </InfoCard>

        <InfoCard>
          <InfoRow
            icon="school-outline"
            title={t("inputs.school")}
            value={school ? `${school.Name} - Neiva` : 'Nombre - Neiva'}
            subtitle={school?.Address ?? 'Dirección'}
            arrow
            last
          />
        </InfoCard>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}
