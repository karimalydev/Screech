// PasswordChecklist.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PasswordChecklistProps = {
  password: string;
  onValidityChange: (isValid: boolean) => void;
};

const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password, onValidityChange }) => {
  const checks = [
    { label: 'At least 6 characters', check: password.length >= 6 },
    { label: 'At least 1 uppercase letter', check: /[A-Z]/.test(password) },
    { label: 'At least 1 special character', check: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const isValid = checks.every(item => item.check);

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  return (
    <View style={styles.container}>
      {checks.map((item, index) => (
        <View key={index}>
          <Text style={item.check ? styles.valid : styles.invalid}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'grey',
  },
});

export default PasswordChecklist;
