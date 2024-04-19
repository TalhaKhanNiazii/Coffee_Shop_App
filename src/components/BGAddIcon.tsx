import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BORDERRADIUS, SPACING} from '../theme/theme';
import CustomIcons from './CustomIcons';

interface BGAddIconProps {
  name: string;
  color: string;
  size: number;
  BGColor: string;
}

const BGAddIcon: React.FC<BGAddIconProps> = ({name, color, size, BGColor}) => {
  return (
    <View
      style={[
        styles.BGAddIconContainer,
        {
          backgroundColor: BGColor,
        },
      ]}>
      <CustomIcons name={name} color={color} size={size} />
    </View>
  );
};

export default BGAddIcon;

const styles = StyleSheet.create({
  BGAddIconContainer: {
    height: SPACING.space_30,
    width: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
