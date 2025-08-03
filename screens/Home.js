import React, { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Image,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import debounce from "lodash.debounce";
import { GlobalStateContext } from "../GlobalStateProvider";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../styles/Theme";
import {
  createMenuTableInDBIfNotExisting,
  readAllMenuFromDB,
  writeMenuItemToDB,
  filterByQueryAndCategories,
} from "../MenuDatabase";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const categories = [
  "starters",
  "mains",
  "desserts",
  "drinks",
  "sides",
  "nonalc",
];

const HomeScreen = ({ navigation }) => {
  const [
    state,
    setIsLoadingTrue,
    setIsLoadingFalse,
    setIsOnboardingCompleteTrue,
    setIsOnboardingCompleteFalse,
  ] = React.useContext(GlobalStateContext);
  const [userData, setUserData] = useState({});
  const [menu, setMenu] = useState([]);
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    categories.map(() => false)
  );
  const [searchBarText, setSearchBarText] = useState("");

  const [filterButtons, setFilterButtons] = useState(
    categories.map((category) => {
      return {
        category: category,
        id: categories.indexOf(category),
      };
    })
  );

  const getUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("userData");
      const data = userDataStr != null ? JSON.parse(userDataStr) : null;
      if (data) {
        setUserData(data);
      } else {
        // Only set onboarding incomplete if we're sure there's no user data
        // Don't do this immediately as it might cause loops
        console.log("No user data found, but staying on home screen");
        setUserData({});
      }
    } catch (error) {
      console.log("Error loading user data:", error);
      setUserData({});
    }
  };

  const getUserDataWrapper = async () => {
    await getUserData();
    updateHeader();
  };

  const LogoTitle = () => {
    return (
      <Image
        style={{ height: 70, resizeMode: "contain" }}
        source={require("../img/Logo.png")}
        accessible={true}
        accessibilityLabel={"Little Lemon Logo"}
      />
    );
  };

  const AvatarTitle = () => {
    if (userData.avatarImage != null) {
      return (
        <Pressable
          onPress={() => {
            navigation.navigate("Profile");
          }}
          disabled={false}
        >
          <Image
            style={styles.avatarImageSmall}
            resizeMode="cover"
            source={{ uri: userData.avatarImage }}
            accessible={true}
            accessibilityLabel={"Avatar imgage"}
          />
        </Pressable>
      );
    } else {
      let initials = { first: ".", second: "." };
      if (userData.firstname != null && userData.firstname.length > 0) {
        initials.first = userData.firstname[0];
      }
      if (userData.lastname != null && userData.lastname.length > 0) {
        initials.second = userData.lastname[0];
      }
      return (
        <Pressable
          onPress={() => {
            navigation.navigate("Profile");
          }}
          disabled={false}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 40,
              backgroundColor: "#495E57",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              {initials.first}
              {initials.second}
            </Text>
          </View>
        </Pressable>
      );
    }
  };

  const updateHeader = () => {
    navigation.setOptions({
      headerTitle: () => <LogoTitle />,
      headerRight: () => <AvatarTitle />,
    });
  };

  const FilterButton = ({ text }) => {
    const isSelected = filterSelections[categories.indexOf(text)];
    return (
      <Pressable
        onPress={() => {
          setFilterSelections(
            filterSelections.map((item, index) =>
              index === categories.indexOf(text) ? !item : item
            )
          );
        }}
        style={[
          styles.categoryButton,
          isSelected ? styles.categoryButtonSelected : styles.categoryButtonUnselected
        ]}
      >
        <Text
          style={[
            styles.categoryButtonText,
            isSelected ? styles.categoryButtonTextSelected : styles.categoryButtonTextUnselected
          ]}
        >
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </Text>
      </Pressable>
    );
  };

  const fetchMenufromAPIAndWriteToSQLiteDB = async () => {
    try {
      const response = await fetch(API_URL);

      const json = await response.json();
      const menujson = await json.menu;

      await createMenuTableInDBIfNotExisting();

      let i = 1;
      menujson.forEach((menuEntry) => {
        writeMenuItemToDB({ id: i, ...menuEntry });
        i++;
      });
    } catch (error) {
      console.log(
        "Error in fetchMenufromAPIAndWriteToSQLiteDB when reading the menu: ",
        error
      );
    }
  };

  const getMenuDataWrapper = async () => {
    await getMenuData();
  };

  const getMenuData = async () => {
    try {
      let menuFromDB = await readAllMenuFromDB();

      // check if menuFromDB is without items, if so then read from API
      if (menuFromDB == null || menuFromDB.length == 0) {
        await fetchMenufromAPIAndWriteToSQLiteDB(); // read menu from API into the SQLite DB
        menuFromDB = await readAllMenuFromDB(); // read menu from SQLite DB into the menu variable
      }
      setMenu(menuFromDB);
    } catch (error) {
      console.log("Error in reading/writing DB-Table: ", error);
    }
  };

  const renderFilterButtonItem = ({ item }) => {
    return <FilterButton text={item.category} />;
  };

  const FlatListFilterButtonSeparator = () => {
    return <View style={styles.categorySeparator} />;
  };

  const renderItem = ({ item }) => {
    let imageUri = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;
    return (
      <Pressable
        style={styles.menuItemContainer}
        onPress={() => {
          // TODO: Navigate to item details or add to cart
        }}
      >
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.menuItemPrice}>${item.price}</Text>
          </View>
          <Image
            style={styles.menuItemImage}
            source={{ uri: imageUri }}
            accessible={true}
            accessibilityLabel={item.name}
          />
        </View>
      </Pressable>
    );
  };

  const FlatListItemSeparator = () => {
    return <View style={styles.menuItemSeparator} />;
  };

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  useEffect(() => {
    // this useEffect ensures initial loading of UserData and MenuData
    getUserDataWrapper();
    getMenuDataWrapper();
  }, []);

  useEffect(() => {
    // this useEffect ensures that the menu items will be updated when the filter or query is changed
    (async () => {
      const activeCategories = categories.filter((c, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const filteredMenuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        setMenu(filteredMenuItems);
      } catch (e) {
        console.log("In HomeScreen: useEffect [filterSelections], error: ", e);
      }
    })();
  }, [filterSelections, query]);

  useEffect(() => {
    // this useEffect is to ensure that the avatar image will be updated when the userData changes
    updateHeader();
  }, [userData]);

  useFocusEffect(
    // useFocusEffect is to ensure the userData will be updated after returning from the ProfileScreen
    React.useCallback(() => {
      getUserDataWrapper();
      return () => {
        // console.log("In HomeScreen: useFocusEffect cleanup");
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.restaurantName}>Little Lemon</Text>
        <View style={styles.heroContent}>
          <View style={styles.heroText}>
            <Text style={styles.location}>Chicago</Text>
            <Text style={styles.description}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../img/Heroimage.png")}
            accessible={true}
            accessibilityLabel="Delicious Mediterranean food"
          />
        </View>
        <SearchBar
          placeholder="Search menu items..."
          placeholderTextColor={Colors.textSecondary}
          onChangeText={handleSearchChange}
          value={searchBarText}
          containerStyle={styles.searchContainer}
          inputStyle={styles.searchInput}
          inputContainerStyle={styles.searchInputContainer}
          searchIcon={{ size: 20, color: Colors.primary }}
        />
      </View>

      {/* Menu Categories Section */}
      <View style={styles.menuSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order for Delivery!</Text>
          <Image
            style={styles.deliveryIcon}
            source={require("../img/DeliveryVan.png")}
            accessible={true}
            accessibilityLabel="Delivery service available"
          />
        </View>
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterButtons}
          renderItem={renderFilterButtonItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={FlatListFilterButtonSeparator}
          style={styles.categoryList}
        />
      </View>

      {/* Menu Items List */}
      <FlatList
        data={menu}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={FlatListItemSeparator}
        style={styles.menuList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Hero Section
  heroSection: {
    backgroundColor: Colors.hero,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  restaurantName: {
    fontSize: Typography.displayLarge,
    fontWeight: Typography.bold,
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroText: {
    flex: 2,
    paddingRight: Spacing.md,
  },
  location: {
    fontSize: Typography.displayMedium,
    fontWeight: Typography.semiBold,
    color: Colors.textOnDark,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.textOnDark,
    lineHeight: 22,
  },
  heroImage: {
    flex: 1,
    height: 150,
    borderRadius: BorderRadius.lg,
    resizeMode: 'cover',
  },
  
  // Search
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 0,
  },
  searchInputContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    height: 45,
    ...Shadows.small,
  },
  searchInput: {
    color: Colors.text,
    fontSize: Typography.body,
  },
  
  // Menu Section
  menuSection: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.title,
    fontWeight: Typography.bold,
    color: Colors.text,
    flex: 1,
  },
  deliveryIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: Spacing.sm,
  },
  
  // Categories
  categoryList: {
    marginVertical: Spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.surface,
  },
  categoryButtonText: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semiBold,
  },
  categoryButtonTextSelected: {
    color: Colors.textOnDark,
  },
  categoryButtonTextUnselected: {
    color: Colors.primary,
  },
  categorySeparator: {
    width: Spacing.sm,
  },
  
  // Menu Items
  menuList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  menuItemContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    ...Shadows.small,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemInfo: {
    flex: 2,
    paddingRight: Spacing.md,
  },
  menuItemName: {
    fontSize: Typography.title,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  menuItemDescription: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  menuItemPrice: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  menuItemImage: {
    flex: 1,
    height: 80,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
  },
  menuItemSeparator: {
    height: 1,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
  },
  
  // Avatar (for header)
  avatarImageSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: Colors.surface,
    borderWidth: 2,
  },
});

export default HomeScreen;
