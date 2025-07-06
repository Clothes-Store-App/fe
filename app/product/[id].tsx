import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { CustomerLayout } from '../../layouts';
import { api } from '../../services/api';
import { Image } from 'expo-image';
import StyleSheet from '../../styles/StyleSheet';
import { scale, verticalScale } from '../../styles/responsive';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import Carousel from 'react-native-reanimated-carousel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProductSize {
  id: number;
  size_name: string;
}

interface ColorSize {
  id: number;
  size: ProductSize;
}

interface ProductColor {
  id: number;
  color_name: string;
  color_code: string;
  image: string;
  colorSizes: ColorSize[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: number;
  colors: ProductColor[];
}

interface ExtendedCustomerLayoutProps {
  showLogo?: boolean;
  showBackButton?: boolean;
  showCart?: boolean;
  showSearch?: boolean;
  title?: string;
  onBackPress?: () => void;
  onLogoPress?: () => void;
  onCartPress?: () => void;
  onSearchPress?: () => void;
  onSearchChange?: (text: string) => void;
  onSearchClear?: () => void;
  searchValue?: string;
  isSearchActive?: boolean;
  scrollEnabled?: boolean;
  activeTab: 'home' | 'products' | 'cart' | 'account';
  onHomePress: () => void;
  onProductsPress: () => void;
  onAccountPress: () => void;
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.products.getById(id as string);
      const productData = response as unknown as Product;
      setProduct(productData);
      if (productData.colors?.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    setSelectedSize(null);
  }, [selectedColor]);

  const handleColorSelect = useCallback((color: ProductColor) => {
    setSelectedColor(color);
  }, []);

  const handleSizeSelect = useCallback((size: ProductSize) => {
    setSelectedSize(size);
  }, []);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedColor || !selectedSize) return;

    const colorSize = selectedColor.colorSizes.find(cs => cs.size.id === selectedSize.id);
    if (!colorSize) return;

    addToCart({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: selectedColor.image,
        description: product.description,
        category: product.category_id.toString(),
        category_id: product.category_id.toString(),
      },
      quantity,
    });

    router.push('/cart');
  }, [product, selectedColor, selectedSize, quantity, addToCart, router]);

  const navigationProps: ExtendedCustomerLayoutProps = {
    showLogo: false,
    showBackButton: true,
    showCart: true,
    title: '',
    onBackPress: () => router.back(),
    onCartPress: () => router.push('/cart'),
    activeTab: 'home',
    onHomePress: () => router.push('/'),
    onProductsPress: () => router.push('/explore'),
    onAccountPress: () => router.push('/account'),
  };

  if (isLoading) {
    return (
      <CustomerLayout {...navigationProps}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      </CustomerLayout>
    );
  }

  if (!product) {
    return (
      <CustomerLayout {...navigationProps}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.text }]}>
            Không tìm thấy sản phẩm
          </Text>
        </View>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout {...navigationProps}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {/* Favorite Button */}
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#ff4b4b" : "#000"}
            />
          </TouchableOpacity>

          {/* Image Carousel */}
          <Carousel
            loop
            width={SCREEN_WIDTH}
            height={verticalScale(400)}
            data={product.colors}
            onSnapToItem={setActiveImageIndex}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  contentFit="cover"
                />
              </View>
            )}
          />

          {/* Carousel Indicators */}
          <View style={styles.indicatorContainer}>
            {product.colors.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: index === activeImageIndex 
                      ? themeColors.primary 
                      : '#ddd'
                  }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={[styles.infoContainer, { backgroundColor: themeColors.cardBackground }]}>
          <Text style={[styles.productName, { color: themeColors.text }]}>
            {product.name}
          </Text>
          
          <Text style={[styles.productPrice, { color: themeColors.primary }]}>
            {formatPrice(product.price)}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={[styles.ratingText, { color: themeColors.secondary }]}>
              4.8 (2 đánh giá)
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: themeColors.secondary }]}>
            {product.description}
          </Text>

          {/* Colors */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Màu sắc:</Text>
            <View style={styles.colorContainer}>
              {product.colors.map(color => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.color_code },
                    selectedColor?.id === color.id && styles.selectedColor,
                  ]}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </View>
          </View>

          {/* Sizes */}
          {selectedColor && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Kích cỡ:</Text>
              <View style={styles.sizeContainer}>
                {selectedColor.colorSizes.map(colorSize => (
                  <TouchableOpacity
                    key={colorSize.id}
                    style={[
                      styles.sizeOption,
                      { borderColor: '#ddd' },
                      selectedSize?.id === colorSize.size.id && {
                        backgroundColor: themeColors.primary,
                        borderColor: themeColors.primary,
                      },
                    ]}
                    onPress={() => handleSizeSelect(colorSize.size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        { color: themeColors.text },
                        selectedSize?.id === colorSize.size.id && { color: 'white' },
                      ]}
                    >
                      {colorSize.size.size_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Số lượng:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, { borderColor: '#ddd' }]}
                onPress={() => handleQuantityChange(-1)}
              >
                <Ionicons name="remove" size={20} color={themeColors.text} />
              </TouchableOpacity>
              <Text style={[styles.quantityText, { color: themeColors.text }]}>
                {quantity}
              </Text>
              <TouchableOpacity
                style={[styles.quantityButton, { borderColor: '#ddd' }]}
                onPress={() => handleQuantityChange(1)}
              >
                <Ionicons name="add" size={20} color={themeColors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomBar, { backgroundColor: themeColors.cardBackground }]}>
        <TouchableOpacity
          style={[
            styles.buyNowButton,
            (!selectedColor || !selectedSize) && { opacity: 0.5 },
          ]}
          onPress={handleAddToCart}
          disabled={!selectedColor || !selectedSize}
        >
          <Text style={styles.buyNowText}>Mua ngay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (!selectedColor || !selectedSize) && { opacity: 0.5 },
          ]}
          onPress={handleAddToCart}
          disabled={!selectedColor || !selectedSize}
        >
          <Ionicons name="cart-outline" size={24} color="#648286" />
          <Text style={[styles.addToCartText, { color: '#648286' }]}>
            Thêm vào giỏ hàng
          </Text>
        </TouchableOpacity>
      </View>
    </CustomerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  errorText: {
    fontSize: scale(16),
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  favoriteButton: {
    position: 'absolute',
    top: scale(16),
    right: scale(16),
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: scale(20),
    padding: scale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: scale(16),
    width: '100%',
    gap: scale(6),
  },
  indicator: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  infoContainer: {
    padding: scale(16),
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: scale(8),
  },
  productPrice: {
    fontSize: scale(20),
    fontWeight: '600',
    marginBottom: scale(8),
    color: '#648286',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: scale(8),
  },
  ratingText: {
    fontSize: scale(14),
    color: '#757575',
  },
  description: {
    fontSize: scale(14),
    lineHeight: scale(20),
    marginBottom: scale(16),
    color: '#757575',
  },
  section: {
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: scale(15),
    fontWeight: '600',
    marginBottom: scale(8),
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  colorOption: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#648286',
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  sizeOption: {
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    borderRadius: scale(4),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(45),
  },
  sizeText: {
    fontSize: scale(14),
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  quantityText: {
    fontSize: scale(15),
    fontWeight: '500',
    marginHorizontal: scale(16),
  },
  bottomBar: {
    padding: scale(12),
    flexDirection: 'row',
    gap: scale(8),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  buyNowButton: {
    flex: 1,
    padding: scale(12),
    borderRadius: scale(8),
    backgroundColor: '#648286',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    color: 'white',
    fontSize: scale(15),
    fontWeight: '600',
  },
  addToCartButton: {
    flex: 1,
    padding: scale(12),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#648286',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    backgroundColor: '#fff',
  },
  addToCartText: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#648286',
  },
}); 