import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useStore} from '../store/Store';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcons from '../components/CustomIcons';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import CoffeeCard from '../components/CoffeeCard';
import BeansData from '../data/BeansData';
import CoffeeData from '../data/CoffeeData';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};
const getCoffeeList = (category: string, data: any) => {
  if (category === 'All') {
    return data;
  } else {
    let coffeeList = data.filter((item: any) => item.name === category);
    return coffeeList;
  }
};

const HomeScreen = ({navigation}: any) => {
  const coffeeList = useStore((state: any) => state.CoffeeList);
  const beansList = useStore((state: any) => state.BeansList);

  const [categories, setCategories] = useState(
    getCategoriesFromData(coffeeList),
  );
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeList(categoryIndex.category, coffeeList),
  );
  const [searchText, setSearchText] = useState('');

  const tabBarHeight = useBottomTabBarHeight(); //to add height in the bottom or below of our View/ScrollView/FlatList
  const ListRef: any = useRef<FlatList>(); // useRef for FlatList in TS

  const handleSearch = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 1,
      });
      setCategoryIndex({index: 0, category: categories[0]});
      setSortedCoffee([
        ...coffeeList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLocaleLowerCase()),
        ),
      ]);
    }
  };
  const handleSearchReset = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({index: 0, category: categories[0]});
    setSortedCoffee([...coffeeList]);
    setSearchText('');
  };
  return (
    <View style={styles.ScreenConatiner}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewContentStyle}>
        <HeaderBar title="Home Screen" />
        <Text style={styles.ScreenTitle}>
          Find the best{'\n'}coffee for you
        </Text>
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity
            onPress={() => {
              handleSearch(searchText);
            }}>
            <CustomIcons
              style={styles.InputIcon}
              name="search"
              color={
                searchText.length > 0
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
              size={FONTSIZE.size_18}
            />
          </TouchableOpacity>
          <TextInput
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              handleSearch(text);
            }}
            placeholder="Find Your Coffee..."
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                handleSearchReset();
              }}>
              <CustomIcons
                style={styles.InputIcon}
                name="close"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_18}
              />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollView}>
          {categories.map((data, index) => (
            <View style={styles.CategoryContainer} key={index.toString()}>
              <TouchableOpacity
                onPress={() => {
                  ListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  }); //this will convert FlatList to it's orignal position.
                  setCategoryIndex({index: index, category: categories[index]});
                  setSortedCoffee([
                    ...getCoffeeList(categories[index], coffeeList), //This will create a new array of sorted coffee.
                  ]);
                }}
                style={styles.CategoryItem}>
                <Text
                  style={[
                    styles.CategoryText,
                    categoryIndex.index === index
                      ? {color: COLORS.primaryOrangeHex}
                      : {},
                  ]}>
                  {data}
                </Text>
                {categoryIndex.index === index ? (
                  <View style={styles.ActiveCategory}></View>
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        {/* Coffee FlatList */}
        <FlatList
          ref={ListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.FlatListContainer}
          ListEmptyComponent={
            <View style={styles.EmptyListContainer}>
              <Text style={styles.EmptyListText}>No Coffee Found</Text>
            </View>
          }
          keyExtractor={item => item.id}
          data={sortedCoffee}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.push('Details', {
                    index: item.index,
                    id: item.id,
                    type: item.type,
                  })
                }>
                <CoffeeCard
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  name={item.name}
                  average_rating={item.average_rating}
                  special_ingredient={item.special_ingredient}
                  prices={item.prices[2]} //cause it's an array of prices and we have to display one at a time.
                  buttonPressHandler={() => {}}
                />
              </TouchableOpacity>
            );
          }}
        />
        <Text style={styles.CoffeeBeansTitle}>Coffee Beans</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.FlatListContainer,
            {
              marginBottom: tabBarHeight, //to add height in the bottom or below of our View
            },
          ]}
          keyExtractor={item => item.id}
          data={BeansData}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.push('Details', {
                    index: item.index,
                    id: item.id,
                    type: item.type,
                  })
                }>
                <CoffeeCard
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  name={item.name}
                  average_rating={item.average_rating}
                  special_ingredient={item.special_ingredient}
                  prices={item.prices[2]} //cause it's an array of prices and we have to display one at a time.
                  buttonPressHandler={() => {}}
                />
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  ScreenConatiner: {flex: 1, backgroundColor: COLORS.primaryBlackHex},
  ScrollViewContentStyle: {
    flexGrow: 1,
  },
  ScreenTitle: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    marginLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    backgroundColor: COLORS.primaryDarkGreyHex,
    margin: SPACING.space_30,
    borderRadius: SPACING.space_20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  InputIcon: {marginHorizontal: SPACING.space_20},
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
  },
  CategoryScrollView: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryItem: {alignItems: 'center'},
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: SPACING.space_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignSelf: 'center',
    alignItems: 'center',
    height: SPACING.space_30 * 3,
    justifyContent: 'center',
  },
  EmptyListText: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryLightGreyHex,
  },
  CoffeeBeansTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.secondaryLightGreyHex,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
  },
});
