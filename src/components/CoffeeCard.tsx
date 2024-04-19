import {
  Dimensions,
  ImageBackground,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import CustomIcons from './CustomIcons';
import BGAddIcon from './BGAddIcon';

const CARD_WIDTH = Dimensions.get('window').width * 0.32;

interface CoffeeCardComponent {
  id: string;
  index: number;
  type: string;
  roasted: string;
  imagelink_square: ImageProps;
  name: string;
  average_rating: number;
  special_ingredient: string;
  prices: any;
  buttonPressHandler: any;
}

const CoffeeCard: React.FC<CoffeeCardComponent> = ({
  id,
  index,
  type,
  roasted,
  imagelink_square,
  name,
  average_rating,
  special_ingredient,
  prices,
  buttonPressHandler,
}) => {
  console.log('X :', special_ingredient);
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
      style={styles.CardLinearGradientContainer}>
      <ImageBackground
        source={imagelink_square}
        resizeMode="cover"
        style={styles.CardImageBG}>
        <View style={styles.CardRatingContainer}>
          <CustomIcons
            name="star"
            color={COLORS.primaryOrangeHex}
            size={FONTSIZE.size_14}
          />
          <Text style={styles.CardRatingText}>{average_rating}</Text>
        </View>
      </ImageBackground>
      <Text style={styles.CardTitle}>{name}</Text>
      <Text style={styles.CardSubtitle}>{special_ingredient}</Text>
      <View style={styles.CardFooterRow}>
        <Text style={styles.CardCurrency}>
          $ <Text style={styles.CardPrice}>{prices.price}</Text>
        </Text>
        <TouchableOpacity>
          <BGAddIcon
            name="add"
            color={COLORS.primaryWhiteHex}
            size={FONTSIZE.size_12}
            BGColor={COLORS.primaryOrangeHex}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default CoffeeCard;

const styles = StyleSheet.create({
  CardLinearGradientContainer: {
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_25,
  },
  CardImageBG: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: BORDERRADIUS.radius_20,
    marginBottom: SPACING.space_15,
    overflow: 'hidden',
  },
  CardRatingContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryBlackRGBA,
    paddingHorizontal: SPACING.space_15,
    gap: SPACING.space_10,
    position: 'absolute',
    borderBottomLeftRadius: BORDERRADIUS.radius_20,
    borderTopRightRadius: BORDERRADIUS.radius_20,
    right: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CardRatingText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    lineHeight: 20,
  },
  CardTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  CardSubtitle: {
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryWhiteHex,
  },
  CardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.space_10,
  },
  CardCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
  },
  CardPrice: {
    color: COLORS.primaryWhiteHex,
  },
});
