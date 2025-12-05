import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Leaf, 
  ArrowRight, 
  MapPin, 
  User, 
  Phone as PhoneIcon,
  MessageSquare,
  Send
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Offer, SiteSetting } from "@shared/schema";

import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const bookingSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(9, "رقم الجوال مطلوب").regex(/^[0-9+]+$/, "رقم جوال غير صالح"),
  notes: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface LatLng {
  lat: number;
  lng: number;
}

function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: LatLng | null; 
  setPosition: (pos: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function Booking() {
  const [, params] = useRoute("/book/:id");
  const offerId = params?.id;
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [position, setPosition] = useState<LatLng | null>(null);

  const { data: offer, isLoading: offerLoading } = useQuery<Offer>({
    queryKey: ["/api/offers", offerId],
    enabled: !!offerId,
  });

  const { data: settings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  const getSetting = (key: string, defaultValue: string = "") => {
    const setting = settings?.find(s => s.key === key);
    return setting?.value || defaultValue;
  };

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (user) {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
      if (fullName) {
        form.setValue("name", fullName);
      }
    }
  }, [user, form]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "جاري توجيهك لصفحة تسجيل الدخول...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [authLoading, user, toast]);

  const onSubmit = (data: BookingForm) => {
    const whatsappNumber = getSetting("whatsapp", "966508265296");
    const locationUrl = position 
      ? `http://maps.google.com/?q=${position.lat},${position.lng}` 
      : "غير محدد";
    
    const message = `*حجز جديد - مركز سبأ للمساج* 🌿
    
👤 *الاسم:* ${data.name}
📞 *الجوال:* ${data.phone}
🎫 *العرض:* ${offer?.title || "غير محدد"}
💰 *السعر:* ${offer?.discountPrice || "غير محدد"}
📍 *الموقع:* ${locationUrl}
${data.notes ? `📝 *ملاحظات:* ${data.notes}` : ""}

_تم الإرسال من تطبيق مركز سبأ_`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    toast({
      title: "تم إرسال الحجز",
      description: "سيتم التواصل معك قريباً",
    });
  };

  if (authLoading || offerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">العرض غير موجود</h2>
            <Link href="/">
              <Button>العودة للرئيسية</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="button-back">
              <ArrowRight className="w-4 h-4" />
              <span>رجوع</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="font-bold">مركز سبأ</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">إكمال الحجز</h1>
          <p className="text-primary-foreground/80 font-tajawal">
            {offer.title}
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  بيانات الحجز
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            الاسم الكامل
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="أدخل اسمك الكامل"
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4" />
                            رقم الجوال (واتساب)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="tel"
                              dir="ltr"
                              placeholder="05xxxxxxxx"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4" />
                        حدد موقعك على الخريطة (اختياري)
                      </FormLabel>
                      <div className="h-64 rounded-lg border border-border overflow-hidden">
                        <MapContainer 
                          center={[21.54, 39.17]} 
                          zoom={12} 
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <LocationMarker position={position} setPosition={setPosition} />
                        </MapContainer>
                      </div>
                      {position && (
                        <p className="text-sm text-muted-foreground mt-2 font-tajawal">
                          تم تحديد موقعك بنجاح
                        </p>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="أي ملاحظات أو طلبات خاصة..."
                              className="resize-none"
                              rows={3}
                              data-testid="input-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full gap-2"
                      data-testid="button-submit"
                    >
                      <SiWhatsapp className="w-5 h-5" />
                      <span>إرسال الحجز عبر الواتساب</span>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl text-center py-4">
                  {offer.icon === "crown" ? "👑" : offer.icon === "party" ? "🎊" : "💎"}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{offer.title}</h3>
                  <p className="text-muted-foreground text-sm font-tajawal">
                    {offer.description}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">السعر</span>
                    <div className="text-left">
                      {offer.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through block">
                          {offer.originalPrice}
                        </span>
                      )}
                      <span className="text-xl font-bold text-primary">
                        {offer.discountPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
