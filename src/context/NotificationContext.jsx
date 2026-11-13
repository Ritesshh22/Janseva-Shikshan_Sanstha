import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection, addDoc, deleteDoc, doc,
    onSnapshot, query, orderBy, setDoc
} from 'firebase/firestore';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [whatsNew, setWhatsNew] = useState([]);
    const [mediaItems, setMediaItems] = useState([]);
    const [bankDetails, setBankDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Notifications (Updates)
    useEffect(() => {
        const q = query(collection(db, 'notifications'), orderBy('date', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, (err) => { console.error(err); setLoading(false); });
        return () => unsub();
    }, []);

    // What's New photos
    useEffect(() => {
        const q = query(collection(db, 'whatsNew'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setWhatsNew(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => console.error(err));
        return () => unsub();
    }, []);

    // Media photos
    useEffect(() => {
        const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setMediaItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => console.error(err));
        return () => unsub();
    }, []);

    // Bank details
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'bankDetails'), (snap) => {
            if (snap.exists()) setBankDetails(snap.data());
            else setBankDetails(null);
        }, (err) => console.error(err));
        return () => unsub();
    }, []);

    // Notifications CRUD
    const addNotification = async (n) => {
        try {
            await addDoc(collection(db, 'notifications'), n);
        } catch (e) {
            console.error(e);
            // Local fallback if firebase fails
            setNotifications(prev => [{ id: 'local_' + Date.now(), ...n }, ...prev]);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await deleteDoc(doc(db, 'notifications', id));
        } catch (e) {
            console.error(e);
            setNotifications(prev => prev.filter(n => n.id !== id));
        }
    };

    // What's New CRUD
    const addWhatsNew = async (item) => {
        const newItem = { ...item, createdAt: new Date().toISOString() };
        try {
            await addDoc(collection(db, 'whatsNew'), newItem);
        } catch (e) {
            console.error(e);
            setWhatsNew(prev => [{ id: 'local_' + Date.now(), ...newItem }, ...prev]);
        }
    };

    const deleteWhatsNew = async (id) => {
        try {
            await deleteDoc(doc(db, 'whatsNew', id));
        } catch (e) {
            console.error(e);
            setWhatsNew(prev => prev.filter(w => w.id !== id));
        }
    };

    // Media CRUD
    const addMedia = async (item) => {
        const newItem = { ...item, createdAt: new Date().toISOString() };
        try {
            await addDoc(collection(db, 'media'), newItem);
        } catch (e) {
            console.error(e);
            setMediaItems(prev => [{ id: 'local_' + Date.now(), ...newItem }, ...prev]);
        }
    };

    const deleteMedia = async (id) => {
        try {
            await deleteDoc(doc(db, 'media', id));
        } catch (e) {
            console.error(e);
            setMediaItems(prev => prev.filter(m => m.id !== id));
        }
    };

    // Bank Details
    const saveBankDetails = async (details) => {
        try {
            await setDoc(doc(db, 'settings', 'bankDetails'), details);
        } catch (e) {
            console.error(e);
            setBankDetails(details);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications, addNotification, deleteNotification, loading,
            whatsNew, addWhatsNew, deleteWhatsNew,
            mediaItems, addMedia, deleteMedia,
            bankDetails, saveBankDetails,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}
