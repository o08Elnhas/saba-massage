import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Phone, 
  MapPin, 
  Clock, 
  Star,
  ChevronLeft,
  Leaf,
  Heart,
  Zap
} from "lucide-react";
import { SiFacebook, SiWhatsapp, SiInstagram } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="default" 
            className="gap-2"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            <span>تسجيل الدخول</span>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">مركز سبأ</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary-foreground/20"
          style={{
            backgroundImage: `linear-gradient(to bottom right, hsl(var(--primary) / 0.92), hsl(142 60% 25% / 0.85)), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-8">
            <Leaf className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            مركز سبأ للمساج
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-tajawal">
            لأن صحتك تستحق الأفضل
          </p>
          <p className="text-lg text-white/80 mb-10 font-tajawal">
            نعيد شحن طاقتك بأفضل خدمات المساج العلاجي والاسترخائي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary font-semibold px-8 py-6 text-lg gap-2"
              onClick={() => {
                const offersSection = document.getElementById('offers');
                offersSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-view-offers"
            >
              <Sparkles className="w-5 h-5" />
              <span>تصفح العروض</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm px-8 py-6 text-lg gap-2"
              onClick={() => window.open('https://wa.me/966508265296', '_blank')}
              data-testid="button-whatsapp-hero"
            >
              <SiWhatsapp className="w-5 h-5" />
              <span>تواصل معنا</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">خبرة عالية</h3>
              <p className="text-muted-foreground font-tajawal">
                فريق متخصص من المعالجين ذوي الخبرة العالية في مختلف أنواع المساج
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">نتائج فورية</h3>
              <p className="text-muted-foreground font-tajawal">
                تشعر بالفرق من أول جلسة مع تقنيات حديثة ومتطورة
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">جودة عالية</h3>
              <p className="text-muted-foreground font-tajawal">
                نستخدم أفضل الزيوت والمنتجات الطبيعية لضمان تجربة مميزة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">🔥</span> عروض حصرية
            </h2>
            <p className="text-muted-foreground text-lg font-tajawal">
              اختر الباقة المناسبة لك واستمتع بأفضل تجربة مساج
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Offer Card 1 */}
            <Card className="relative overflow-visible hover-elevate transition-all duration-300">
              <div className="absolute -top-3 right-4 z-10">
                <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                  الأكثر طلباً
                </span>
              </div>
              <CardContent className="p-6 pt-8">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-bold mb-2">جلسة تجريبية أولى</h3>
                <p className="text-muted-foreground mb-4 font-tajawal">
                  للعملاء الجدد فقط - جلسة استرخاء كاملة
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground line-through">٣٠٠ ريال</span>
                  <span className="text-2xl font-bold text-primary">١٩٩ ريال</span>
                </div>
                <Button 
                  className="w-full gap-2"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-book-offer-1"
                >
                  احجز الآن
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Offer Card 2 */}
            <Card className="relative overflow-visible hover-elevate transition-all duration-300">
              <div className="absolute -top-3 right-4 z-10">
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  توفير
                </span>
              </div>
              <CardContent className="p-6 pt-8">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-xl font-bold mb-2">باقة 4 جلسات</h3>
                <p className="text-muted-foreground mb-4 font-tajawal">
                  برنامج علاجي متكامل للظهر والرقبة
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground line-through">السعر العادي</span>
                  <span className="text-2xl font-bold text-primary">خصم ٢٥٪</span>
                </div>
                <Button 
                  className="w-full gap-2"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-book-offer-2"
                >
                  احجز الآن
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Offer Card 3 */}
            <Card className="relative overflow-visible hover-elevate transition-all duration-300 border-primary border-2">
              <div className="absolute -top-3 right-4 z-10">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  VIP
                </span>
              </div>
              <CardContent className="p-6 pt-8">
                <div className="text-4xl mb-4">🎊</div>
                <h3 className="text-xl font-bold mb-2">باقة 8 جلسات</h3>
                <p className="text-muted-foreground mb-4 font-tajawal">
                  استعادة كاملة للنشاط + هدية مجانية
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground line-through">السعر العادي</span>
                  <span className="text-2xl font-bold text-primary">خصم ٤٠٪</span>
                </div>
                <Button 
                  className="w-full gap-2"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-book-offer-3"
                >
                  احجز الآن
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">تواصل معنا</h2>
            <p className="text-muted-foreground text-lg font-tajawal">
              نحن هنا لخدمتك على مدار الساعة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">العنوان</h4>
                      <p className="text-muted-foreground font-tajawal">جدة - حي السلامة - شارع الملك فهد</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">الهاتف</h4>
                      <p className="text-muted-foreground font-tajawal" dir="ltr">+966 50 826 5296</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">ساعات العمل</h4>
                      <p className="text-muted-foreground font-tajawal">من ١٠ صباحاً حتى ١٢ منتصف الليل</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button 
                    size="icon" 
                    variant="outline"
                    className="w-12 h-12"
                    onClick={() => window.open('https://wa.me/966508265296', '_blank')}
                    data-testid="button-whatsapp-contact"
                  >
                    <SiWhatsapp className="w-5 h-5 text-green-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline"
                    className="w-12 h-12"
                    onClick={() => window.open('https://facebook.com/SabaSpaCenter', '_blank')}
                    data-testid="button-facebook-contact"
                  >
                    <SiFacebook className="w-5 h-5 text-blue-600" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline"
                    className="w-12 h-12"
                    onClick={() => window.open('https://instagram.com/SabaSpaCenter', '_blank')}
                    data-testid="button-instagram-contact"
                  >
                    <SiInstagram className="w-5 h-5 text-pink-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8 flex flex-col justify-center h-full">
                <div className="text-center">
                  <SiWhatsapp className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">احجز عبر الواتساب</h3>
                  <p className="text-muted-foreground mb-6 font-tajawal">
                    تواصل معنا مباشرة واحصل على موعدك في دقائق
                  </p>
                  <Button 
                    size="lg"
                    className="gap-2 px-8"
                    onClick={() => window.open('https://wa.me/966508265296', '_blank')}
                    data-testid="button-whatsapp-cta"
                  >
                    <SiWhatsapp className="w-5 h-5" />
                    <span>ابدأ المحادثة</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
