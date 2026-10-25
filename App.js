
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

const baseProducts = [
  { name: "Aqua RO Purifier", category: "RO Purifier", price: 8999 },
  { name: "Crystal UV Purifier", category: "UV Purifier", price: 6499 },
  { name: "Copper RO Purifier", category: "RO Purifier", price: 10999 },
  { name: "Mineral Water Purifier", category: "RO Purifier", price: 9999 },
  { name: "Wall Mount Dispenser", category: "Dispenser", price: 5499 },
  { name: "Sediment Filter", category: "Filter", price: 399 },
  { name: "Carbon Filter", category: "Filter", price: 599 },
  { name: "RO Membrane", category: "Spare Parts", price: 1499 },
  { name: "Booster Pump", category: "Spare Parts", price: 1299 },
  { name: "Storage Tank", category: "Spare Parts", price: 999 },
];

const products = Array.from({ length: 50 }, (_, index) => {
  const item = baseProducts[index % baseProducts.length];

  return {
    id: String(index + 1),
    name:
      index < baseProducts.length
        ? item.name
        : `${item.name} ${Math.floor(index / baseProducts.length) + 1}`,
    category: item.category,
    price: item.price + Math.floor(index / baseProducts.length) * 100,
  };
});

const money = (amount) => "₹" + amount.toLocaleString("en-IN");
const RAZORPAY_KEY_ID = "rzp_test_TrLuXAcYYsYIAq";

export default function App() {
  const [page, setPage] = useState("Home");
  const [role, setRole] = useState("Customer");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("Installation");

  const priceFor = (product) =>
    role === "Dealer" ? Math.round(product.price * 0.8) : product.price;

  const addToCart = (product) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.id === product.id);

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });

   ToastAndroid.show("Added to cart!", ToastAndroid.SHORT);
   
  };

  const updateQuantity = (id, change) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + priceFor(item) * item.quantity,
    0
  );
  
  const payWithRazorpay = async () => {
    if (cart.length === 0) {
      Alert.alert("Cart is empty", "Please add a product first.");
      return;
    }

    try {
      const payment = await RazorpayCheckout.open({
        key: RAZORPAY_KEY_ID,
        method: "card",
        amount: String(Math.round(total * 100)),
        currency: "INR",
        name: "CALIFNCO",
        description: "Water purifier order - Test Mode",
        prefill: {
         contact: phone || "",
        name: customerName || "",
        email: "test@example.com",
},
        theme: { color: "#075985" },
      });

      const newOrder = {
        id: String(Date.now()),
        items: [...cart],
        total,
        status: "Test Payment Successful",
        paymentId: payment.razorpay_payment_id,
        date: new Date().toLocaleDateString(),
      };

      setOrders((previous) => [newOrder, ...previous]);
      setCart([]);
      setPage("Orders");

      Alert.alert(
        "Test Payment Successful",
        "Payment ID: " + payment.razorpay_payment_id
      );
    } catch (error) {
  Alert.alert(
    "Payment Error",
    `Code: ${error.code || "unknown"}\nMessage: ${error.description || error.message || "Unknown error"}`
  );
}
  };


  const placeOrder = () => {
    if (cart.length === 0) {
      Alert.alert("Cart is empty", "Please add a product first.");
      return;
    }

    const newOrder = {
      id: String(Date.now()),
      items: [...cart],
      total,
      status: "Placed - Demo",
      date: new Date().toLocaleDateString(),
    };

    setOrders((previous) => [newOrder, ...previous]);
    setCart([]);
    setPage("Orders");

    Alert.alert(
      "Demo order created",
      "No real payment has been made."
    );
  };

  const submitService = () => {
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Missing details", "Please fill in all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      Alert.alert("Invalid phone", "Enter a 10-digit mobile number.");
      return;
    }

    const newRequest = {
      id: String(Date.now()),
      name: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      service: serviceType,
      status: "Requested - Demo",
    };

    setRequests((previous) => [newRequest, ...previous]);
    setCustomerName("");
    setPhone("");
    setAddress("");

    Alert.alert(
      "Success!",
      "Your service request has been submitted successfully."
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = ["Home", "Cart", "Orders", "Service", "Profile"];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.brand}>CALIFNCO</Text>
        <Text style={styles.tagline}>Pure Water. Better Living.</Text>

        <View style={styles.roleRow}>
          {["Customer", "Dealer"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.roleButton,
                role === item && styles.roleSelected,
              ]}
              onPress={() => setRole(item)}
            >
              <Text
                style={[
                  styles.roleText,
                  role === item && styles.roleSelectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.notice}>
          Prototype • {role} preview • Demo data
        </Text>
      </View>

      <View style={styles.navigation}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.navButton,
              page === item && styles.navActive,
            ]}
            onPress={() => setPage(item)}
          >
            <Text
              style={[
                styles.navText,
                page === item && styles.navTextActive,
              ]}
            >
              {item === "Cart" ? `Cart (${cart.length})` : item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {page === "Home" && (
          <>
            <View style={styles.hero}>
              <Text style={styles.heroSmall}>WELCOME TO CALIFNCO</Text>
              <Text style={styles.heroTitle}>
                Pure water for every home
              </Text>
              <Text style={styles.heroDescription}>
                Explore purifiers, filters and water-care essentials.
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => setPage("Home")}
              >
                <Text style={styles.heroButtonText}>
                  Explore Products ↓
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Our Products</Text>
            <Text style={styles.subtitle}>
              Browse {products.length} catalogue entries
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Search purifiers, filters..."
              value={search}
              onChangeText={setSearch}
            />

            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImage}>
                  <Text style={styles.waterDrop}>💧</Text>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.category}>{product.category}</Text>
                  <Text style={styles.price}>
                    {money(priceFor(product))}
                  </Text>

                  {role === "Dealer" && (
                    <Text style={styles.dealerLabel}>
                      Wholesale preview
                    </Text>
                  )}

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => addToCart(product)}
                  >
                    <Text style={styles.primaryButtonText}>
                      + Add to Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {page === "Cart" && (
          <>
            <Text style={styles.title}>Shopping Cart</Text>

            {cart.length === 0 && (
              <Text style={styles.empty}>
                Your cart is empty. Explore our products to get started.
              </Text>
            )}

            {cart.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.price}>
                    {money(priceFor(item))}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.total}>Total: {money(total)}</Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={placeOrder}
            >
              <Text style={styles.primaryButtonText}>
                Place Demo Order
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
  style={styles.primaryButton}
  onPress={payWithRazorpay}
>
  <Text style={styles.primaryButtonText}>
    Pay with Razorpay (Test Mode)
  </Text>
</TouchableOpacity>

            <Text style={styles.note}>
              Prototype checkout only. No payment is collected.
            </Text>
          </>
        )}

        {page === "Orders" && (
          <>
            <Text style={styles.title}>My Orders</Text>

            {orders.length === 0 && (
              <Text style={styles.empty}>No orders placed yet.</Text>
            )}

            {orders.map((order) => (
              <View key={order.id} style={styles.card}>
                <Text style={styles.productName}>
                  Order #{order.id.slice(-6)}
                </Text>
                <Text style={styles.category}>
                  {order.date} · {order.status}
                </Text>
                {order.items.map((item) => (
                  <Text key={item.id} style={styles.line}>
                    {item.name} × {item.quantity}
                  </Text>
                ))}
                <Text style={styles.price}>{money(order.total)}</Text>
              </View>
            ))}
          </>
        )}

        {page === "Service" && (
          <>
            <Text style={styles.title}>Service Booking</Text>
            <Text style={styles.subtitle}>
              Request installation or purifier maintenance.
            </Text>

            {[
              "Installation",
              "Maintenance",
              "Filter Replacement",
            ].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.serviceOption,
                  serviceType === item && styles.serviceSelected,
                ]}
                onPress={() => setServiceType(item)}
              >
                <Text style={styles.serviceText}>
                  {serviceType === item ? "✓ " : ""}
                  {item}
                </Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Complete service address"
              multiline
              value={address}
              onChangeText={setAddress}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={submitService}
            >
              <Text style={styles.primaryButtonText}>
                Submit Service Request
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>
              Requests in this session
            </Text>

            {requests.map((request) => (
              <View key={request.id} style={styles.card}>
                <Text style={styles.productName}>{request.service}</Text>
                <Text>{request.name} · {request.phone}</Text>
                <Text>{request.address}</Text>
                <Text style={styles.category}>{request.status}</Text>
              </View>
            ))}
          </>
        )}

        {page === "Profile" && (
          <>
            <Text style={styles.title}>My Profile</Text>

            <View style={styles.card}>
              <Text style={styles.productName}>Current role: {role}</Text>
              <Text style={styles.subtitle}>
                Use the Customer and Dealer buttons at the top to preview
                both catalogue views.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Prototype Features</Text>
            {[
              "50 catalogue entries",
              "Customer and dealer price preview",
              "Shopping cart and quantity updates",
              "Demo order history",
              "Service booking form",
            ].map((feature) => (
              <Text key={feature} style={styles.feature}>
                ✓ {feature}
              </Text>
            ))}

            <Text style={styles.note}>
              Real authentication, dealer approval, persistent storage
              and the admin panel still need to be implemented.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F8FC",
  },
  header: {
    backgroundColor: "#075985",
    padding: 18,
    paddingTop: 12,
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  tagline: {
    color: "#D6F1FF",
    marginTop: 4,
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  roleButton: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#B7E4FA",
    borderRadius: 20,
  },
  roleSelected: {
    backgroundColor: "#FFFFFF",
  },
  roleText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  roleSelectedText: {
    color: "#075985",
  },
  notice: {
    color: "#D6F1FF",
    marginTop: 9,
    fontSize: 11,
  },
  navigation: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderColor: "#DCE7EF",
  },
  navButton: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
  },
  navActive: {
    borderBottomWidth: 3,
    borderColor: "#0284C7",
  },
  navText: {
    fontSize: 12,
    color: "#617386",
  },
  navTextActive: {
    color: "#075985",
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    paddingBottom: 35,
  },
  hero: {
    backgroundColor: "#DFF3FF",
    padding: 20,
    borderRadius: 17,
    marginBottom: 23,
  },
  heroSmall: {
    color: "#0874A7",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#123D58",
    marginTop: 10,
  },
  heroDescription: {
    color: "#42667D",
    lineHeight: 21,
    marginTop: 8,
  },
  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: "#075985",
    padding: 11,
    borderRadius: 9,
    marginTop: 15,
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  title: {
    fontSize: 23,
    color: "#15374C",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#657B8D",
    marginTop: 7,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E4ED",
    borderWidth: 1,
    borderRadius: 10,
    padding: 13,
    marginTop: 10,
    color: "#15374C",
  },
  addressInput: {
    minHeight: 85,
    textAlignVertical: "top",
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 13,
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E1EAF1",
  },
  productImage: {
    width: 75,
    height: 95,
    borderRadius: 10,
    backgroundColor: "#E3F5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  waterDrop: {
    fontSize: 36,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#193A4F",
  },
  category: {
    color: "#6A7F90",
    fontSize: 12,
    marginTop: 5,
  },
  price: {
    color: "#075985",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 7,
  },
  dealerLabel: {
    color: "#217548",
    fontSize: 11,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: "#0284C7",
    padding: 12,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 11,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  empty: {
    color: "#687D8F",
    marginTop: 18,
    lineHeight: 22,
  },
  cartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  quantityButton: {
    backgroundColor: "#E3F4FF",
    height: 31,
    width: 31,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 20,
    color: "#075985",
  },
  quantity: {
    fontWeight: "bold",
  },
  total: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 21,
    color: "#15374C",
    marginTop: 22,
  },
  note: {
    color: "#657B8D",
    fontSize: 12,
    marginTop: 14,
    lineHeight: 19,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 11,
    marginTop: 12,
    gap: 5,
  },
  line: {
    color: "#425E72",
    marginTop: 5,
  },
  serviceOption: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E4ED",
    padding: 13,
    borderRadius: 9,
    marginTop: 8,
  },
  serviceSelected: {
    borderColor: "#0284C7",
    backgroundColor: "#E3F4FF",
  },
  serviceText: {
    color: "#19445F",
  },
  sectionTitle: {
    color: "#15374C",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 22,
  },
  feature: {
    color: "#31546A",
    marginTop: 12,
  },
});
