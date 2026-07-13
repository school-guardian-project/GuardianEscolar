// src/components/buttons/PrimaryButton.js
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@core/services/ThemeService';
export default function PrimaryButton({ text, onPress }) {
  const { theme } = useTheme();
  

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.buttonApply }]}
      onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,      
    height: 55,            
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: 'white',        
    fontWeight: 'bold',    
    fontSize: 16,          
  },
});