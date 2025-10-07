import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Filter,
  Package,
} from 'lucide-react-native';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  prescription: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const MedicalGroceryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = ['All', 'Medications', 'Supplements', 'First Aid', 'Medical Devices', 'Personal Care'];

  const products: Product[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Medications',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
      description: 'Pain relief and fever reducer',
      inStock: true,
      prescription: false,
    },
    {
      id: '2',
      name: 'Vitamin D3 1000 IU',
      category: 'Supplements',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1550572017-4814c6f5a5e6?w=400&q=80',
      description: 'Daily vitamin D supplement',
      inStock: true,
      prescription: false,
    },
    {
      id: '3',
      name: 'First Aid Kit',
      category: 'First Aid',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80',
      description: 'Complete first aid kit for home',
      inStock: true,
      prescription: false,
    },
    {
      id: '4',
      name: 'Digital Thermometer',
      category: 'Medical Devices',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
      description: 'Fast and accurate temperature reading',
      inStock: true,
      prescription: false,
    },
    {
      id: '5',
      name: 'Blood Pressure Monitor',
      category: 'Medical Devices',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400&q=80',
      description: 'Automatic blood pressure monitor',
      inStock: true,
      prescription: false,
    },
    {
      id: '6',
      name: 'Omega-3 Fish Oil',
      category: 'Supplements',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1550572017-4814c6f5a5e6?w=400&q=80',
      description: 'Heart health supplement',
      inStock: true,
      prescription: false,
    },
    {
      id: '7',
      name: 'Hand Sanitizer 500ml',
      category: 'Personal Care',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&q=80',
      description: 'Antibacterial hand sanitizer',
      inStock: true,
      prescription: false,
    },
    {
      id: '8',
      name: 'Face Masks (50 pack)',
      category: 'Personal Care',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&q=80',
      description: 'Disposable face masks',
      inStock: true,
      prescription: false,
    },
    {
      id: '9',
      name: 'Ibuprofen 400mg',
      category: 'Medications',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
      description: 'Anti-inflammatory pain relief',
      inStock: true,
      prescription: false,
    },
    {
      id: '10',
      name: 'Multivitamin Complex',
      category: 'Supplements',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1550572017-4814c6f5a5e6?w=400&q=80',
      description: 'Complete daily multivitamin',
      inStock: true,
      prescription: false,
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } else {
      setCart(cart.filter((item) => item.id !== productId));
    }
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Medical Grocery</Text>
          <TouchableOpacity style={styles.cartButton} onPress={() => setShowCart(true)}>
            <ShoppingCart size={24} color="#4F7FFF" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.description}
                </Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(product)}
                  >
                    <Plus size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showCart} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.cartModal}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Shopping Cart</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartContent}>
              {cart.length === 0 ? (
                <View style={styles.emptyCart}>
                  <Package size={64} color="#D1D5DB" />
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                </View>
              ) : (
                cart.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Minus size={16} color="#4F7FFF" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => addToCart(item)}
                      >
                        <Plus size={16} color="#4F7FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalAmount}>${cartTotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#4F7FFF',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E5E7EB',
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F7FFF',
  },
  addButton: {
    backgroundColor: '#4F7FFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  cartModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  cartContent: {
    flex: 1,
    padding: 20,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#4F7FFF',
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 24,
    textAlign: 'center',
  },
  cartFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  checkoutButton: {
    backgroundColor: '#4F7FFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MedicalGroceryScreen;
