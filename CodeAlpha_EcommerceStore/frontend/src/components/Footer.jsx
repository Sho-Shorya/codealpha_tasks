import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-6xl mx-auto px-4 md:flex md:justify-between gap-5">

        {/* Info Section */}
        <div className="mb-6 md:mb-0">
          <Link to="/">
            <img src="/Ekart1.png" alt="EKart Logo" className="w-28 h-auto" />
          </Link>
          <p className="mt-2 text-sm">
            Powering Your World with the Best in Electronics.
          </p>
          {/* <p className="mt-2 text-sm">
            123 Electronics St, Style City, NY 10001
          </p> */}
          {/* <p className="text-sm">Email: support@zaptro.com</p>
          <p className="text-sm">Phone: (123) 456-7890</p> */}
        </div>

        {/* Customer Service */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Customer Service</h3>
          <ul className="mt-2 text-sm space-y-2">
            <li>Contact Us</li>
            <li>Shipping & Returns</li>
            <li>FAQs</li>
            <li>Order Tracking</li>
            <li>Size Guide</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex gap-[10px] mt-2 text-xl">
            <FaFacebook />
            <FaInstagram />
            <FaTwitterSquare />
            <FaPinterest />
          </div>
        </div>

        {/* Newsletter */}
        <div className="w-full md:w-64">
          <h3 className="text-xl font-semibold">Stay in the Loop</h3>
          <p className="mt-2 text-sm word-wrap">
            Subscribe to get special offers.
          </p>
          <form className="mt-4 flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 p-2 text-sm bg-white rounded-md border border-white/40 text-black focus:outline-none focus:ring-2"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-sm text-white px-4 py-2 rounded-md hover:bg-emerald-700 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-pink-600">EKart</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
