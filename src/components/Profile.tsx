import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, Settings, LogOut, Mail, Calendar,
  Ruler, Weight, Activity, Target, Utensils,
  ShieldCheck, Edit3, X, Save, Check, Camera, Upload
} from 'lucide-react';
import type { User } from '../types';

// Opsi Pilihan untuk Form
const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (Jarang Gerak)' },
  { value: 'light', label: 'Light (Olahraga 1-3x/minggu)' },
  { value: 'moderate', label: 'Moderate (Olahraga 3-5x/minggu)' },
  { value: 'active', label: 'Active (Olahraga 6-7x/minggu)' },
  { value: 'very-active', label: 'Very Active (Fisik Berat/Atlet)' }
];

const GOALS = [
  { value: 'weight-loss', label: 'Weight Loss (Turun Berat)' },
  { value: 'weight-gain', label: 'Weight Gain (Naik Berat)' },
  { value: 'muscle-gain', label: 'Muscle Gain (Membentuk Otot)' }
];

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Dairy-Free', 'Gluten-Free', 'Halal'];
const ALLERGY_OPTIONS = ['Nuts', 'Dairy', 'Soy', 'Eggs', 'Shellfish', 'Seafood', 'Gluten'];

// Extend tipe User secara lokal untuk properti avatar (karena di types/index.ts belum ada)
interface ExtendedUser extends User {
  avatar?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  
  // State untuk Modal
  const [activeModal, setActiveModal] = useState<'settings' | 'goals' | 'preferences' | null>(null);
  const [formData, setFormData] = useState<Partial<ExtendedUser>>({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // --- HANDLERS ---
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('user');
      navigate('/');
      window.location.reload();
    }
  };

  const openModal = (type: 'settings' | 'goals' | 'preferences') => {
    if (user) {
      setFormData({ ...user }); 
      setActiveModal(type);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!user) return;
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'idealWeight' || name === 'dailyCalories' 
        ? Number(value) 
        : value
    }));
  };

  // --- IMAGE UPLOAD LOGIC (Base64) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran (max 2MB agar localStorage tidak penuh)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Simpan string base64 ke state form
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleArrayItem = (field: 'dietaryRestrictions' | 'allergies', item: string) => {
    const currentList = formData[field] || [];
    const newList = currentList.includes(item)
      ? currentList.filter(i => i !== item)
      : [...currentList, item];
    setFormData(prev => ({ ...prev, [field]: newList }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full px-6 md:px-12 pb-20 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pt-4 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
             <span className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-200">
              <UserIcon className="w-8 h-8" />
            </span>
            My Profile
          </h1>
          <p className="text-gray-500 mt-2 ml-1">Kelola informasi dan preferensi akunmu.</p>
        </div>
        
        <button 
          onClick={() => openModal('settings')}
          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          <span>Edit Profil</span>
        </button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: IDENTITY CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-md border border-white/60 p-8 rounded-3xl shadow-sm relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-purple-100 to-blue-50 z-0"></div>
            
            <div className="relative z-10 mt-12">
              {/* Avatar Display */}
              <div className="w-32 h-32 mx-auto rounded-full p-1 shadow-xl bg-white">
                <div className="w-full h-full rounded-full overflow-hidden relative group/avatar">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-5xl font-black text-white uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h2>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-1 mb-6">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>

              {/* Status Badge */}
              <div className="flex justify-center gap-3 mb-8">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 border border-green-200">
                  <ShieldCheck className="w-3 h-3" /> Verified User
                </span>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Member sejak</span>
                  <span className="font-bold text-gray-900">{joinDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status Akun</span>
                  <span className="font-bold text-green-600">Aktif</span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full mt-8 py-3 rounded-xl border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: DETAILS GRID */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Physical Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Tinggi', val: user.height, unit: 'cm', icon: Ruler, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Berat', val: user.weight, unit: 'kg', icon: Weight, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Umur', val: user.age, unit: 'th', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'BMI', val: user.bmi, unit: '', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur p-4 rounded-2xl border border-white/60 shadow-sm hover:-translate-y-1 transition-transform">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.val} <span className="text-xs font-normal text-gray-400">{stat.unit}</span></p>
              </div>
            ))}
          </div>

          {/* Section 2: Goals & Activity */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm group">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                Target & Aktivitas
              </h3>
              <button 
                onClick={() => openModal('goals')}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 capitalize">{user.goal.replace('-', ' ')}</p>
                    <p className="text-xs text-gray-500">Target Utama</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{user.idealWeight}</span>
                  <span className="text-xs text-gray-500 ml-1">kg</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 capitalize">{user.activityLevel.replace('-', ' ')}</p>
                    <p className="text-xs text-gray-500">Level Aktivitas</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{user.dailyCalories}</span>
                  <span className="text-xs text-gray-500 ml-1">kcal/hari</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dietary Preferences */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-green-500" />
                Preferensi Makanan
              </h3>
              <button 
                onClick={() => openModal('preferences')}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pantangan Diet</p>
                <div className="flex flex-wrap gap-2">
                  {user.dietaryRestrictions.length > 0 ? (
                    user.dietaryRestrictions.map((item, index) => (
                      <span key={index} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-bold text-xs border border-green-100">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">Tidak ada pantangan</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Alergi</p>
                <div className="flex flex-wrap gap-2">
                  {user.allergies.length > 0 ? (
                    user.allergies.map((item, index) => (
                      <span key={index} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold text-xs border border-red-100">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">Tidak ada alergi</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS AREA --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {activeModal === 'settings' && 'Edit Profil'}
                {activeModal === 'goals' && 'Edit Target & Aktivitas'}
                {activeModal === 'preferences' && 'Preferensi Makanan'}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto">
              
              {/* FORM: SETTINGS (Termasuk Ganti Foto) */}
              {activeModal === 'settings' && (
                <div className="space-y-6">
                  {/* Photo Uploader */}
                  <div className="flex flex-col items-center">
                     <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                           {formData.avatar ? (
                             <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                               {formData.name?.charAt(0)}
                             </div>
                           )}
                        </div>
                        {/* Overlay Icon */}
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-white shadow-sm">
                           <Edit3 className="w-3 h-3 text-white" />
                        </div>
                     </div>
                     <p className="text-xs text-gray-500 mt-2">Klik foto untuk mengganti</p>
                     
                     {/* Hidden File Input */}
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={handleImageUpload}
                     />
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                      <input name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Umur</label>
                        <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" value={formData.email} disabled className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi (cm)</label>
                        <input name="height" type="number" value={formData.height} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
                        <input name="weight" type="number" value={formData.weight} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FORM: GOALS */}
              {activeModal === 'goals' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Utama</label>
                    <select name="goal" value={formData.goal} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none bg-white">
                      {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Berat Badan (kg)</label>
                    <input name="idealWeight" type="number" value={formData.idealWeight} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level Aktivitas</label>
                    <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none bg-white">
                      {ACTIVITY_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Kalori Harian</label>
                    <input name="dailyCalories" type="number" value={formData.dailyCalories} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none" />
                    <p className="text-xs text-gray-500 mt-1">*Disarankan update otomatis jika mengubah aktivitas.</p>
                  </div>
                </div>
              )}

              {/* FORM: PREFERENCES */}
              {activeModal === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Dietary Restrictions</label>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_OPTIONS.map(item => (
                        <button
                          key={item}
                          onClick={() => toggleArrayItem('dietaryRestrictions', item)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${
                            formData.dietaryRestrictions?.includes(item)
                              ? 'bg-green-100 border-green-200 text-green-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {item}
                          {formData.dietaryRestrictions?.includes(item) && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Alergi</label>
                    <div className="flex flex-wrap gap-2">
                      {ALLERGY_OPTIONS.map(item => (
                        <button
                          key={item}
                          onClick={() => toggleArrayItem('allergies', item)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${
                            formData.allergies?.includes(item)
                              ? 'bg-red-100 border-red-200 text-red-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {item}
                          {formData.allergies?.includes(item) && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-300"
              >
                <Save className="w-4 h-4" />
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;