"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

interface MapViewerProps {
  address: string;
  googleMapsLink?: string;
  isOpen: boolean;
  onClose: () => void;
}

// FREE Map Solution for Egypt
export function MapViewer({ address, googleMapsLink, isOpen, onClose }: MapViewerProps) {
  // Option 1: Use Google Maps Embed (FREE - no API key needed for embeds)
  const getGoogleEmbedUrl = () => {
    if (googleMapsLink) {
      // Extract coordinates from Google Maps link if available
      const coordMatch = googleMapsLink.match(/q=([\d.]+),([\d.]+)/);
      if (coordMatch) {
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d500!2d${coordMatch[2]}!3d${coordMatch[1]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg`;
      }
    }
    // Fallback to address search
    const encodedAddress = encodeURIComponent(address + ", Egypt");
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d30.9!3d29.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU0JzAwLjAiTiAzMMKwNTQnMDAuMCJF!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg&q=${encodedAddress}`;
  };

  // Option 2: OpenStreetMap (Completely FREE)
  const getOpenStreetMapUrl = () => {
    const encodedAddress = encodeURIComponent(address + ", 6th of October, Egypt");
    return `https://www.openstreetmap.org/export/embed.html?bbox=30.8%2C29.9%2C31.0%2C30.0&layer=mapnik&marker=29.95%2C30.9`;
  };

  const [mapType, setMapType] = useState<"google" | "osm">("google");

  const openInGoogleMaps = () => {
    if (googleMapsLink) {
      window.open(googleMapsLink, "_blank");
    } else {
      const encodedAddress = encodeURIComponent(address + ", 6th of October, Egypt");
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
    }
  };

  const openNavigation = () => {
    // Try to open native maps app
    const encodedAddress = encodeURIComponent(address);
    
    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try Google Maps app first
      window.location.href = `comgooglemaps://?q=${encodedAddress}`;
      
      // Fallback to web after delay
      setTimeout(() => {
        openInGoogleMaps();
      }, 500);
    } else {
      openInGoogleMaps();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#d4a574]" />
            موقع العميل
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Address Display */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">{address}</p>
          </div>

          {/* Map Type Toggle */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mapType === "google" ? "default" : "outline"}
              onClick={() => setMapType("google")}
            >
              Google Maps
            </Button>
            <Button
              size="sm"
              variant={mapType === "osm" ? "default" : "outline"}
              onClick={() => setMapType("osm")}
            >
              OpenStreetMap (مجاني)
            </Button>
          </div>

          {/* Map Embed */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
            <iframe
              src={mapType === "google" ? getGoogleEmbedUrl() : getOpenStreetMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-[#d4a574] hover:bg-[#c49464] text-[#1a1a1a]"
              onClick={openNavigation}
            >
              <Navigation className="w-4 h-4 ml-2" />
              بدء الاتجاهات
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={openInGoogleMaps}
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              فتح في Google Maps
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 text-center">
            إذا لم يظهر الموقع بدقة، اضغط "فتح في Google Maps" للوصول الأدق
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simple Address Map Link Button
export function MapLinkButton({ address, googleMapsLink }: { address: string; googleMapsLink?: string }) {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setShowMap(true)}
      >
        <MapPin className="w-4 h-4" />
        عرض على الخريطة
      </Button>

      <MapViewer
        address={address}
        googleMapsLink={googleMapsLink}
        isOpen={showMap}
        onClose={() => setShowMap(false)}
      />
    </>
  );
}

// Static Map Preview (for cards)
export function StaticMapPreview({ address }: { address: string }) {
  // Generate a static map URL (using OpenStreetMap static tiles - FREE)
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=29.9656,30.9183&zoom=14&size=400x200&maptype=mapnik`;
  
  return (
    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${staticMapUrl})`,
          filter: "grayscale(20%)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-2 right-2 left-2">
        <p className="text-white text-sm truncate">{address}</p>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-[#d4a574] rounded-full flex items-center justify-center shadow-lg">
          <MapPin className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
