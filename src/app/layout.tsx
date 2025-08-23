import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A&M Capital - Simulateur d'Investissement Locatif",
  description: "Simulateur professionnel avec données de marché en temps réel. Calculez instantanément votre rentabilité locative.",
  keywords: ["investissement", "immobilier", "locatif", "rentabilité", "airbnb", "simulation"],
  authors: [{ name: "A&M Capital" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: '#2563eb',
                      'primary-dark': '#1d4ed8',
                      secondary: '#64748b',
                      success: '#10b981',
                      warning: '#f59e0b',
                      error: '#ef4444',
                      'am-navy': '#121f3e',        // couleur perso
                      'am-navy-light': '#1a2a4a',  // version plus claire pour hover
                      'am-navy-text': '#142344',
                      
                    },
                    animation: {
                      'fade-in': 'fadeIn 0.3s ease-out',
                      'slide-in': 'slideIn 0.3s ease-out',
                      'blob': 'blob 7s infinite',
                    },
                    keyframes: {
                      fadeIn: {
                        '0%': { opacity: '0', transform: 'translateY(10px)' },
                        '100%': { opacity: '1', transform: 'translateY(0)' },
                      },
                      slideIn: {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(0)' },
                      },
                      blob: {
                        '0%': { transform: 'translate(0px, 0px) scale(1)' },
                        '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                        '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                        '100%': { transform: 'translate(0px, 0px) scale(1)' },
                      }
                    }
                  }
                }
              }
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .custom-slider::-webkit-slider-thumb {
                appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #2563eb;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              .custom-slider::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #d4af37;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          {children}
        </div>
      </body>
    </html>
  );
}