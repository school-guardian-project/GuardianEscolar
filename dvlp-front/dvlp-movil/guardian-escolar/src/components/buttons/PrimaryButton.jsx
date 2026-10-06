// src/components/buttons/PrimaryButton.js
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@core/services/ThemeService';
export default function PrimaryButton({ text, onPress, disabled = false }) {
  const { theme } = useTheme();
  

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.buttonApply, opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled}>
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