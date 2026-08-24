import { db, doc, getDoc, setDoc, getDocs, collection, onSnapshot } from '../firebase';
import { UserProfile, DigitalProduct, OrderRecord } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

// Sync User to Firestore
export async function syncUserToFirestore(user: UserProfile): Promise<void> {
  try {
    if (!user || !user.id) return;
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore sync user error:', error);
  }
}

// Fetch User from Firestore
export async function fetchUserFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Firestore fetch user error:', error);
  }
  return null;
}

// Save Order to Firestore
export async function saveOrderToFirestore(order: OrderRecord, userId: string): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', order.orderId);
    await setDoc(orderRef, {
      ...order,
      userId,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore save order error:', error);
  }
}

// Save Product to Firestore
export async function saveProductToFirestore(product: DigitalProduct): Promise<void> {
  try {
    const prodRef = doc(db, 'products', product.id);
    await setDoc(prodRef, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore save product error:', error);
  }
}

// Seed all initial products into Firestore
export async function seedProductsToFirestore(products: DigitalProduct[] = INITIAL_PRODUCTS): Promise<boolean> {
  try {
    console.log(`Seeding ${products.length} digital drops to Firestore...`);
    for (const prod of products) {
      const prodRef = doc(db, 'products', prod.id);
      await setDoc(prodRef, {
        ...prod,
        seededAt: new Date().toISOString()
      }, { merge: true });
    }
    console.log('Successfully seeded all products into Firestore database.');
    return true;
  } catch (error) {
    console.error('Error seeding products to Firestore:', error);
    return false;
  }
}

// Load Catalog from Firestore with automatic seeding & merging
export async function loadProductsFromFirestore(): Promise<DigitalProduct[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const items: DigitalProduct[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push(docSnap.data() as DigitalProduct);
    });

    if (items.length === 0) {
      console.log('No products in Firestore yet. Auto-seeding initial digital drop catalog...');
      await seedProductsToFirestore(INITIAL_PRODUCTS);
      return [...INITIAL_PRODUCTS];
    }

    // Merge any missing initial products (e.g. eBooks/PDFs) or categories into Firestore
    const existingIds = new Set(items.map((i) => i.id));
    const missingProducts = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
    
    // Also check if any existing product in Firestore has outdated category (like prod-13 / prod-14)
    const updatedProducts: DigitalProduct[] = [];
    for (const initial of INITIAL_PRODUCTS) {
      const existing = items.find((i) => i.id === initial.id);
      if (existing && existing.category !== initial.category) {
        existing.category = initial.category;
        existing.tags = initial.tags;
        saveProductToFirestore(existing);
      }
    }

    if (missingProducts.length > 0) {
      console.log(`Syncing ${missingProducts.length} newly added products to Firestore...`);
      for (const missing of missingProducts) {
        await saveProductToFirestore(missing);
        items.push(missing);
      }
    }

    return items;
  } catch (error) {
    console.warn('Firestore load products error, returning fallback:', error);
    return [...INITIAL_PRODUCTS];
  }
}

// Subscribe to Realtime Firestore Product Updates
export function subscribeToProducts(onUpdate: (products: DigitalProduct[]) => void): () => void {
  try {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const items: DigitalProduct[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as DigitalProduct);
        });
        onUpdate(items);
      }
    }, (error) => {
      console.warn('Realtime products listener error:', error);
    });
    return unsub;
  } catch (e) {
    console.warn('Snapshot listener failed:', e);
    return () => {};
  }
}
