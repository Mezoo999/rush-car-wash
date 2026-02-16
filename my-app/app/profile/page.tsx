"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Car, 
  Edit2, 
  Check,
  Loader2,
  ArrowRight,
  LogOut,
  Plus,
  Trash2,
  Zap,
  Sparkles,
  Star,
  Calendar,
  MapPin
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Car as CarType, User as UserType, CAR_BRANDS, CATEGORY_LABELS } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCar, setShowAddCar] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) throw error;
        setUser(userData);
        
        // Fetch user's cars
        const { data: carsData } = await supabase
          .from('cars')
          .select('*')
          .eq('user_id', authUser.id)
          .eq('is_active', true);
        
        if (carsData) setCars(carsData);
      }
    } catch (error) {
      toast.error('فشل في تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1976D2]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] to-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-[#1976D2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-[#1976D2]" />
            </div>
            <p className="text-[#1E3A5F] mb-4">يرجى تسجيل الدخول أولاً</p>
            <Link href="/auth/login">
              <Button className="w-full bg-[#1976D2] hover:bg-[#1565C0]">
                تسجيل الدخول
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-[#1976D2] hover:text-[#1E3A5F] mb-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Link>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">حسابي 🚗</h1>
        </div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-[#1976D2]/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-[#1976D2]">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-[#1976D2] to-[#64B5F6] text-white text-2xl">
                        {user.full_name?.charAt(0) || "ر"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#FFA726] rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#1E3A5F]" />
                    </div>
                  </div>

                  <div className="text-center md:text-right flex-1">
                    <h2 className="text-2xl font-bold text-[#1E3A5F]">
                      {user.full_name || "عميل Rush"}
                    </h2>
                    <p className="text-[#1976D2]" dir="ltr">{user.email}</p>
                    <p className="text-[#1976D2]" dir="ltr">{user.phone}</p>
                    
                    <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                      <Badge className="bg-[#1976D2]/10 text-[#1976D2] border-[#1976D2]/20">
                        {user.role === 'customer' ? '⭐ عميل Rush' : user.role}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-[#1976D2]/60 mt-2">
                      🎉 عضو منذ {new Date(user.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={handleLogout} 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* My Cars Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-[#1976D2]/20 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                    <Car className="w-5 h-5 text-[#1976D2]" />
                    عربياتي 🚗
                  </CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddCar(!showAddCar)}
                    className="bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F]"
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة عربية
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Car Form */}
                <AnimatePresence>
                  {showAddCar && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-[#1976D2]/5 rounded-xl border border-[#1976D2]/20"
                    >
                      <AddCarForm 
                        onSuccess={() => {
                          setShowAddCar(false);
                          fetchUserProfile();
                        }}
                        onCancel={() => setShowAddCar(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cars List */}
                {cars.length > 0 ? (
                  <div className="grid gap-3">
                    {cars.map((car, index) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#1976D2]/10 hover:border-[#1976D2]/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#1976D2] to-[#64B5F6] rounded-xl flex items-center justify-center">
                            <Car className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1E3A5F]">{car.brand} {car.model}</h4>
                            <p className="text-sm text-[#1976D2]/60">
                              {car.year} • {car.color} • {car.plate_number}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#FFA726]/10 text-[#FFA726] border-[#FFA726]/20">
                            {CATEGORY_LABELS[car.category]}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCar(car.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#1976D2]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Car className="w-8 h-8 text-[#1976D2]" />
                    </div>
                    <p className="text-[#1976D2]/60">مفيش عربية محفوظة عندك</p>
                    <p className="text-sm text-[#1976D2]/40">أضف عربيتك عشان تحجز أسرع!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProfileEditCard user={user} onUpdate={fetchUserProfile} />
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <Link href="/dashboard">
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-[#1976D2]/30">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1976D2] to-[#64B5F6] rounded-2xl flex items-center justify-center">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3A5F]">طلباتي</h3>
                    <p className="text-sm text-[#1976D2]">شوف سجل طلباتك</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/booking">
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-[#FFA726]/30">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFA726] to-[#FF9800] rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3A5F]">احجز رشة</h3>
                    <p className="text-sm text-[#1976D2]">اطلب رشة جديدة دلوقتي</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Add Car Form Component
function AddCarForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    plate_number: "",
    category: "standard" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await (supabase as any)
        .from('cars')
        .insert({
          user_id: user.id,
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          color: formData.color,
          plate_number: formData.plate_number.toUpperCase(),
          category: formData.category,
        });

      if (error) throw error;
      
      toast.success("✅ تم إضافة العربية بنجاح!");
      onSuccess();
    } catch (error) {
      toast.error("فشل في إضافة العربية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[#1E3A5F] text-sm">الماركة</Label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any, brand: e.target.value })}
            className="w-full mt-1 p-2 border border-[#1976D2]/20 rounded-lg text-sm"
            required
          >
            <option value="">اختر الماركة</option>
            {CAR_BRANDS.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-[#1E3A5F] text-sm">الموديل</Label>
          <Input
            placeholder="，例如: Toyota Camry"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-[#1E3A5F] text-sm">السنة</Label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className="mt-1"
            min={1990}
            max={new Date().getFullYear() + 1}
          />
        </div>
        <div>
          <Label className="text-[#1E3A5F] text-sm">اللون</Label>
          <Input
            placeholder="أبيض، أسود..."
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-[#1E3A5F] text-sm">رقم اللوحة</Label>
          <Input
            placeholder="أ ب 1234"
            value={formData.plate_number}
            onChange={(e) => setFormData({ ...formData, plate_number: e.target.value.toUpperCase() })}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-[#1E3A5F] text-sm">نوع العربية</Label>
        <div className="flex gap-2 mt-2">
          {[
            { value: "standard", label: "🚗 عادية" },
            { value: "suv", label: "🚙 دفع رباعي" },
            { value: "luxury", label: "🏎️ فاخرة" },
          ].map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat.value as any })}
              className={`flex-1 p-2 rounded-lg border-2 transition-all text-sm ${
                formData.category === cat.value
                  ? "border-[#1976D2] bg-[#1976D2]/10 text-[#1976D2]"
                  : "border-gray-200 text-gray-600 hover:border-[#1976D2]/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-[#1976D2] hover:bg-[#1565C0]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 ml-2" />}
          حفظ
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}

// Profile Edit Component
function ProfileEditCard({ user, onUpdate }: { user: UserType; onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    phone: user.phone || "",
    email: user.email || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('✅ تم تحديث البيانات بنجاح!');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error('فشل في تحديث البيانات');
    }
    setIsSaving(false);
  };

  return (
    <Card className="border-2 border-[#1976D2]/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[#1E3A5F]">
          <span className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#1976D2]" />
            البيانات الشخصية
          </span>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-[#1976D2] text-[#1976D2]">
              <Edit2 className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label className="text-[#1E3A5F]">الاسم الكامل</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={!isEditing}
              className="mt-1 border-[#1976D2]/20"
            />
          </div>
          <div>
            <Label className="text-[#1E3A5F]">رقم الهاتف</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="mt-1 border-[#1976D2]/20"
              dir="ltr"
            />
          </div>
          <div>
            <Label className="text-[#1E3A5F]">البريد الإلكتروني</Label>
            <Input
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="mt-1 border-[#1976D2]/20"
              dir="ltr"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-[#1976D2] hover:bg-[#1565C0]">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 ml-2" />}
              حفظ
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              إلغاء
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Delete car function
async function deleteCar(carId: string) {
  try {
    const { error } = await (supabase as any)
      .from('cars')
      .update({ is_active: false })
      .eq('id', carId);

    if (error) throw error;
    
    toast.success("تم حذف العربية");
    window.location.reload();
  } catch (error) {
    toast.error("فشل في حذف العربية");
  }
}
