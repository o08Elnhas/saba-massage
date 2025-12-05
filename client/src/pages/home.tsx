import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { 
  Leaf, 
  LogOut, 
  Settings, 
  ChevronLeft,
  Phone,
  MapPin,
  Clock,
  Sparkles
} from "lucide-react";
import { SiFacebook, SiWhatsapp, SiInstagram } from "react-icons/si";
import type { Offer, SiteSetting } from "@shared/schema";

const iconMap: Record<string, string> = {
  sparkles: "💎",
  crown: "👑",
  party: "🎊",
  fire: "🔥",
  star: "⭐",
  heart: "❤️",
  gem: "💠",
  gift: "🎁",
};

export default function Home() {
  const { user } = useAuth();

  const { data: offers, isLoading: offersLoading } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
  });

  const { data: settings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  const getSetting = (key: string, defaultValue: string = "") => {
    const setting = settings?.find(s => s.key === key);
    return setting?.value || defaultValue;
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user?.isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="gap-2" data-testid="link-admin">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">مركز سبأ</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary-foreground/20"
          style={{
            backgroundImage: `linear-gradient(to bottom right, hsl(var(--primary) / 0.92), hsl(142 60% 25% / 0.85)), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {getSetting("hero_title", "مرحباً بك في مركز سبأ")}
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-tajawal">
            {user?.firstName ? `أهلاً ${user.firstName}،` : ""} {getSetting("hero_subtitle", "اختر الباقة المناسبة لك")}
          </p>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span>عروضنا الحصرية</span>
            </h2>
            <p className="text-muted-foreground font-tajawal">
              اختر الباقة المناسبة واحجز موعدك الآن
            </p>
          </div>

          {offersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : offers && offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.filter(o => o.isActive).map((offer) => (
                <Card 
                  key={offer.id} 
                  className="relative overflow-visible hover-elevate transition-all duration-300"
                  data-testid={`card-offer-${offer.id}`}
                >
                  {offer.badge && (
                    <div className="absolute -top-3 right-4 z-10">
                      <Badge 
                        variant={offer.badgeColor === "destructive" ? "destructive" : "default"}
                        className={offer.badgeColor === "amber" ? "bg-amber-500 text-white" : ""}
                      >
                        {offer.badge}
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    <div className="text-4xl mb-4">
                      {iconMap[offer.icon || "sparkles"] || "💎"}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-muted-foreground mb-4 font-tajawal line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      {offer.originalPrice && (
                        <span className="text-muted-foreground line-through">
                          {offer.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-primary">
                        {offer.discountPrice}
                      </span>
                    </div>
                    <Link href={`/book/${offer.id}`}>
                      <Button 
                        className="w-full gap-2"
                        data-testid={`button-book-${offer.id}`}
                      >
                        احجز الآن
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">لا توجد عروض حالياً</h3>
                <p className="text-muted-foreground font-tajawal">
                  سيتم إضافة عروض جديدة قريباً
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">تواصل معنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">العنوان</h4>
                <p className="text-muted-foreground font-tajawal text-sm">
                  {getSetting("address", "جدة - حي السلامة - شارع الملك فهد")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="w-10 h-10 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">الهاتف</h4>
                <p className="text-muted-foreground font-tajawal text-sm" dir="ltr">
                  {getSetting("phone", "+966 50 826 5296")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">ساعات العمل</h4>
                <p className="text-muted-foreground font-tajawal text-sm">
                  {getSetting("working_hours", "من ١٠ صباحاً حتى ١٢ منتصف الليل")}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              size="icon"
              variant="outline"
              className="w-12 h-12"
              onClick={() => window.open(`https://wa.me/${getSetting("whatsapp", "966508265296")}`, '_blank')}
              data-testid="button-whatsapp"
            >
              <SiWhatsapp className="w-5 h-5 text-green-500" />
            </Button>
            <Button 
              size="icon"
              variant="outline"
              className="w-12 h-12"
              onClick={() => window.open(getSetting("facebook", "https://facebook.com/SabaSpaCenter"), '_blank')}
              data-testid="button-facebook"
            >
              <SiFacebook className="w-5 h-5 text-blue-600" />
            </Button>
            <Button 
              size="icon"
              variant="outline"
              className="w-12 h-12"
              onClick={() => window.open(getSetting("instagram", "https://instagram.com/SabaSpaCenter"), '_blank')}
              data-testid="button-instagram"
            >
              <SiInstagram className="w-5 h-5 text-pink-500" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="font-bold">مركز سبأ للمساج</span>
          </div>
          <p className="text-muted-foreground text-sm font-tajawal">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
