import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Save,
  Globe,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Share2
} from "lucide-react";
import { SiFacebook, SiWhatsapp, SiInstagram } from "react-icons/si";
import type { SiteSetting } from "@shared/schema";

const settingsSchema = z.object({
  hero_title: z.string().min(1, "العنوان مطلوب"),
  hero_subtitle: z.string().min(1, "العنوان الفرعي مطلوب"),
  address: z.string().min(1, "العنوان مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  whatsapp: z.string().min(1, "رقم الواتساب مطلوب"),
  working_hours: z.string().min(1, "ساعات العمل مطلوبة"),
  facebook: z.string().url("رابط غير صالح").or(z.string().length(0)),
  instagram: z.string().url("رابط غير صالح").or(z.string().length(0)),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const defaultSettings: SettingsForm = {
  hero_title: "مرحباً بك في مركز سبأ",
  hero_subtitle: "اختر الباقة المناسبة لك",
  address: "جدة - حي السلامة - شارع الملك فهد",
  phone: "+966 50 826 5296",
  whatsapp: "966508265296",
  working_hours: "من ١٠ صباحاً حتى ١٢ منتصف الليل",
  facebook: "https://facebook.com/SabaSpaCenter",
  instagram: "https://instagram.com/SabaSpaCenter",
};

export default function AdminSettings() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: settings, isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  useEffect(() => {
    if (settings) {
      const settingsMap: Record<string, string> = {};
      settings.forEach(s => {
        settingsMap[s.key] = s.value;
      });
      
      form.reset({
        hero_title: settingsMap.hero_title || defaultSettings.hero_title,
        hero_subtitle: settingsMap.hero_subtitle || defaultSettings.hero_subtitle,
        address: settingsMap.address || defaultSettings.address,
        phone: settingsMap.phone || defaultSettings.phone,
        whatsapp: settingsMap.whatsapp || defaultSettings.whatsapp,
        working_hours: settingsMap.working_hours || defaultSettings.working_hours,
        facebook: settingsMap.facebook || defaultSettings.facebook,
        instagram: settingsMap.instagram || defaultSettings.instagram,
      });
    }
  }, [settings, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      const settingsArray = Object.entries(data).map(([key, value]) => ({
        key,
        value: value || "",
        label: getSettingLabel(key),
        type: "text",
      }));
      return await apiRequest("POST", "/api/settings/bulk", { settings: settingsArray });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "تم حفظ الإعدادات بنجاح" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مصرح",
          description: "جاري إعادة توجيهك...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "غير مصرح",
        description: "يرجى تسجيل الدخول",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  useEffect(() => {
    if (!authLoading && user && !user.isAdmin) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحيات الوصول",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [authLoading, user, toast]);

  const getSettingLabel = (key: string): string => {
    const labels: Record<string, string> = {
      hero_title: "عنوان الصفحة الرئيسية",
      hero_subtitle: "العنوان الفرعي",
      address: "العنوان",
      phone: "رقم الهاتف",
      whatsapp: "رقم الواتساب",
      working_hours: "ساعات العمل",
      facebook: "رابط فيسبوك",
      instagram: "رابط انستجرام",
    };
    return labels[key] || key;
  };

  const onSubmit = (data: SettingsForm) => {
    saveMutation.mutate(data);
  };

  if (authLoading || settingsLoading) {
    return (
      <AdminLayout title="الإعدادات">
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </AdminLayout>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <AdminLayout title="الإعدادات">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Hero Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                إعدادات الصفحة الرئيسية
              </CardTitle>
              <CardDescription>
                تخصيص العناوين والنصوص في الصفحة الرئيسية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="hero_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان الرئيسي</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مرحباً بك في مركز سبأ" data-testid="input-hero-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero_subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان الفرعي</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="اختر الباقة المناسبة لك" data-testid="input-hero-subtitle" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                معلومات التواصل
              </CardTitle>
              <CardDescription>
                معلومات الاتصال المعروضة للعملاء
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الهاتف
                      </FormLabel>
                      <FormControl>
                        <Input {...field} dir="ltr" placeholder="+966 50 826 5296" data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <SiWhatsapp className="w-4 h-4 text-green-500" />
                        رقم الواتساب
                      </FormLabel>
                      <FormControl>
                        <Input {...field} dir="ltr" placeholder="966508265296" data-testid="input-whatsapp" />
                      </FormControl>
                      <FormDescription>بدون علامة + أو مسافات</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      العنوان
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="جدة - حي السلامة - شارع الملك فهد"
                        className="resize-none"
                        rows={2}
                        data-testid="input-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="working_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      ساعات العمل
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="من ١٠ صباحاً حتى ١٢ منتصف الليل" data-testid="input-working-hours" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Social Media Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                روابط السوشيال ميديا
              </CardTitle>
              <CardDescription>
                روابط حساباتك على منصات التواصل الاجتماعي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <SiFacebook className="w-4 h-4 text-blue-600" />
                      رابط فيسبوك
                    </FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" placeholder="https://facebook.com/SabaSpaCenter" data-testid="input-facebook" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <SiInstagram className="w-4 h-4 text-pink-500" />
                      رابط انستجرام
                    </FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" placeholder="https://instagram.com/SabaSpaCenter" data-testid="input-instagram" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="lg" 
              className="gap-2 px-8"
              disabled={saveMutation.isPending}
              data-testid="button-save-settings"
            >
              <Save className="w-5 h-5" />
              <span>{saveMutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}</span>
            </Button>
          </div>
        </form>
      </Form>
    </AdminLayout>
  );
}
