"use client";
import { useState } from "react";
import Link from "next/link";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sign in to Continue
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in or create an account to add items to your cart and place orders.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/login"
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition block text-center"
            >
              Sign In
            </Link>
            
            <Link
              href="/signup"
              onClick={onClose}
              className="w-full bg-white text-orange-700 py-3 px-6 rounded-lg font-medium hover:bg-orange-50 transition border border-orange-200 block text-center"
            >
              Create Account
            </Link>
            
            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 px-4 rounded-lg font-medium hover:text-gray-700 transition"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 