import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Tag, 
  TrendingUp, 
  Settings, 
  Plus,
  ArrowLeft
} from "lucide-react";
import type { Offer, SiteSetting } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: offers, isLoading: offersLoading } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "غير مصرح",
        description: "يرجى تسجيل الدخول للوصول للوحة التحكم",
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
        description: "ليس لديك صلاحيات الوصول للوحة التحكم",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [authLoading, user, toast]);

  if (authLoading) {
    return (
      <AdminLayout title="لوحة التحكم">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  const activeOffers = offers?.filter(o => o.isActive).length || 0;
  const totalOffers = offers?.length || 0;
  const totalSettings = settings?.length || 0;

  return (
    <AdminLayout title="لوحة التحكم">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-l from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <h2 className="text-2xl font-bold mb-2">
            مرحباً {user.firstName || "المسؤول"} 👋
          </h2>
          <p className="text-muted-foreground font-tajawal">
            مرحباً بك في لوحة تحكم مركز سبأ للمساج. من هنا يمكنك إدارة جميع محتويات الموقع.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                إجمالي العروض
              </CardTitle>
              <Tag className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              {offersLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{totalOffers}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">عرض في النظام</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                العروض النشطة
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              {offersLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-green-500">{activeOffers}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">معروضة للعملاء</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                الإعدادات
              </CardTitle>
              <Settings className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{totalSettings}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">إعداد مخصص</p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                إجراء سريع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/admin/offers">
                <Button 
                  variant="secondary" 
                  className="w-full gap-2"
                  data-testid="button-add-offer-quick"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة عرض جديد</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                إدارة العروض
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground font-tajawal">
                أضف وعدّل واحذف العروض المعروضة للعملاء. يمكنك تفعيل أو تعطيل أي عرض.
              </p>
              <Link href="/admin/offers">
                <Button className="gap-2" data-testid="button-manage-offers">
                  <span>إدارة العروض</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                إعدادات الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground font-tajawal">
                عدّل معلومات التواصل والعناوين والنصوص المعروضة في الموقع.
              </p>
              <Link href="/admin/settings">
                <Button className="gap-2" data-testid="button-manage-settings">
                  <span>الإعدادات</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Offers */}
        {offers && offers.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>أحدث العروض</CardTitle>
              <Link href="/admin/offers">
                <Button variant="ghost" size="sm" className="gap-1">
                  عرض الكل
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offers.slice(0, 3).map((offer) => (
                  <div 
                    key={offer.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {offer.icon === "crown" ? "👑" : offer.icon === "party" ? "🎊" : "💎"}
                      </div>
                      <div>
                        <h4 className="font-medium">{offer.title}</h4>
                        <p className="text-sm text-muted-foreground">{offer.discountPrice}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      offer.isActive 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {offer.isActive ? "نشط" : "معطل"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
