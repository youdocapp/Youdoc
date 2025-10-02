import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface WheelDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

const WheelDatePicker: React.FC<WheelDatePickerProps> = ({
  value,
  onChange,
  label = 'Select Date'
}) => {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    button: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      backgroundColor: colors.card
    },
    buttonText: {
      fontSize: 16,
      color: colors.text
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 24,
      width: '80%'
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center' as const
    },
    modalButtons: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginTop: 16
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      marginHorizontal: 8
    },
    cancelButton: {
      backgroundColor: colors.border
    },
    confirmButton: {
      backgroundColor: colors.primary
    },
    buttonTextWhite: {
      color: 'white',
      textAlign: 'center' as const,
      fontWeight: '600' as const
    }
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.buttonText}>{formatDate(value)}</Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <Text style={styles.buttonText}>{formatDate(value)}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.buttonTextWhite}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setShowPicker(false);
                }}
              >
                <Text style={styles.buttonTextWhite}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WheelDatePicker;
