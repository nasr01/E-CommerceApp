import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 l:grid-cols-4 xl:grid-cols-6 gap-8 text-gray-700">

                {/* Logo + Description */}
                <div className="md:col-span-2">
                    <div className="flex items-center mb-4">
                        <div className="bg-black text-white font-bold text-xl w-10 h-10 flex items-center justify-center rounded mr-3">
                            T
                        </div>
                        <span className="text-xl font-semibold">ShopMart</span>
                    </div>
                    <p className="text-sm mb-4">
                        Your one-stop destination for the latest technology, fashion, and
                        lifestyle products. Quality guaranteed with fast shipping and
                        excellent customer service.
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <MapPin size={16} />
                            123 Shop Street, Octoper City, DC 12345
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={16} />
                            (+20) 01093333333
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={16} />
                            support@shopmart.com
                        </li>
                    </ul>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="font-semibold mb-4">SHOP</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Electronics</li>
                        <li>Fashion</li>
                        <li>Home & Garden</li>
                        <li>Sports</li>
                        <li>Deals</li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h3 className="font-semibold mb-4">CUSTOMER SERVICE</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Contact Us</li>
                        <li>Help Center</li>
                        <li>Track Your Order</li>
                        <li>Returns & Exchanges</li>
                        <li>Size Guide</li>
                    </ul>
                </div>

                {/* About */}
                <div>
                    <h3 className="font-semibold mb-4">ABOUT</h3>
                    <ul className="space-y-2 text-sm">
                        <li>About ShopMart</li>
                        <li>Careers</li>
                        <li>Press</li>
                        <li>Investor Relations</li>
                        <li>Sustainability</li>
                    </ul>
                </div>

                {/* Policies */}
                <div>
                    <h3 className="font-semibold mb-4">POLICIES</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                        <li>Cookie Policy</li>
                        <li>Shipping Policy</li>
                        <li>Refund Policy</li>
                    </ul>
                </div>
            </div>

            {/* Bottom copyright */}
            <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} ShopMart. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
