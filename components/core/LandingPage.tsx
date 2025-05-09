"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { navLinks, reviews, trainers } from "@/consts/core-data";
import { useBranches } from "@/hooks/useFetchSalles";
import { SignIn, SignUp } from "@clerk/nextjs";
import { Facebook, Instagram, Menu, Signal, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function LandingPage() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const { branches } = useBranches();

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-black/80 to-black/90 px-3 md:p-0">
        <header className="max-w-6xl mx-auto py-3">
          <div className="container flex justify-between items-center">
            {/* Logo */}
            <div className="text-2xl font-bold text-white">
              <span className="text-blue-400">M</span>Fitness
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8 font-bold">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 py-4"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Dropdown */}
            <div className="md:hidden text-white">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Menu size={28} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border border-white/10 text-white w-48 mt-2">
                  {navLinks.map((link) => (
                    <DropdownMenuItem key={link.name} asChild>
                      <a
                        href={link.href}
                        className="block w-full px-2 py-1.5 hover:text-blue-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen p-4 py-12 md:p-0 flex items-center bg-[url('https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2023/04/Beginner-Deadlift-Workout.jpg?fit=1894%2C1337&ssl=1')] bg-cover bg-top bg-no-repeat relative before:absolute before:inset-0 before:bg-black/20"
      >
        <div className="container relative z-10 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-6">
            MFitness – Lieu pour vos objectifs de fitness
          </h1>
          <p className="text-lg mb-8">
            Nous offrons des entraînements fonctionnels, des boîtes de
            plyométrie, des cours d'aérobic, du TRX et bien plus encore.
          </p>
          <a href={"#about"}>
            <Button
              variant="outline"
              className="bg-transparent text-white border-blue-400 hover:bg-blue-400 hover:text-black"
            >
              Nos services
            </Button>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="md:py-16 bg-gray-900 p-4 py-12 ">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold uppercase mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-20 after:h-0.5 after:bg-blue-400 pb-2">
              About <span className="text-blue-400">M</span>Fitness
            </h2>
            <p className="text-gray-300">
              MFitness est votre destination idéale pour atteindre vos objectifs
              de santé et de forme...
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://www.eliteprofitca.com/wp-content/uploads/2020/12/IMG_9030-scaled.jpg"
              alt="about-image-one"
              className="w-full h-auto rounded outline-2 outline-offset-4 outline-gray-600"
            />
            <img
              src="https://gymcrafter.com/wp-content/uploads/2017/11/dumbbells-1474426_1920.jpg"
              alt="about-image-two"
              className="w-full h-auto rounded outline-2 outline-offset-4 outline-gray-600"
            />
            <img
              src="https://cdn.shopify.com/s/files/1/0471/3332/7519/files/10-best-and-worst-cardio-machines-v2-10.jpg?v=1730755039"
              alt="about-image-three"
              className="col-span-2 w-3/4 -mt-36 mx-auto rounded outline-4 outline-offset-4 outline-blue-400"
            />
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="md:py-16 bg-black p-4 py-12 ">
        <div className="container">
          <h2 className="text-3xl font-bold uppercase text-center mb-12 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-blue-400 pb-2">
            Les branches disponibles
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {branches.map((branch) => (
              <Card
                key={branch.id}
                className="relative overflow-hidden group border-blue-400 border-l-2 p-0"
              >
                <div className="relative">
                  <img
                    src={branch.image || ""}
                    alt={branch.title || ""}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-0 text-white bg-black/70 group-hover:h-full transition-all duration-500 flex items-center justify-center p-6 overflow-hidden">
                    <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="mb-4">{branch.description}</p>

                      <Link
                        href={`/salle/preview/${branch.id}`}
                        className="text-blue-400 border-b border-blue-400 hover:italic"
                      >
                        Les sports disponibles →
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-3/4 bg-gradient-to-r from-blue-400 to-blue-200 text-black p-4 py-12 py-2 clip-path-branch">
                  {branch.title}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section id="offer" className="py-16 bg-gray-900 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold uppercase mb-6">
              Offre spéciale cet été : profitez de tous les avantages pendant un
              an avec une réduction de 20 %.
            </h2>
            <p className="text-gray-300 mb-8">
              🔥 Promo exclusive : abonnement 12 mois = payez seulement 10 !
            </p>
            <Button className="bg-blue-400 hover:bg-blue-500 text-black">
              En savoir plus👉
            </Button>
          </div>

          <div className="h-full absolute top-0 right-0 z-40 w-full md:w-1/3 bg-[url('https://d1heoihvzm7u4h.cloudfront.net/7680c65526397ce129e200d2823c34fe51e988d0_November_banner_27.jpg')] bg-cover bg-center brightness-110"></div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="md:py-16 bg-black p-4 py-12 ">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold uppercase mb-4 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-blue-400 pb-2">
              Les entraîneurs
            </h2>
            <p className="text-gray-300">
              "Vous pouvez consulter les entraîneurs concernant la condition
              physique et la nutrition saine."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {trainers.map((trainer) => (
              <Card
                key={trainer.id}
                className="relative overflow-hidden group border-blue-400 border-l-2 p-0"
              >
                <div className="relative">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-80 object-cover group-hover:brightness-75 transition-all duration-300"
                  />
                  <div className="absolute top-0 right-0 w-0 h-full bg-gray-800/90 group-hover:w-16 transition-all duration-300 flex flex-col items-center justify-center space-y-4 overflow-hidden">
                    <a
                      href={trainer.socials.facebook}
                      target="_blank"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Facebook className="text-white" size={30} />
                    </a>
                    <a
                      href={trainer.socials.insta}
                      target="_blank"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Instagram className="text-white" size={30} />
                    </a>
                    <a
                      target="_blank"
                      href={trainer.socials.twitter}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Twitter className="text-white" size={30} />
                    </a>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-3/4 bg-gradient-to-r from-blue-400 to-blue-200 text-black p-4 py-12 py-2 clip-path-branch">
                  <p className="font-bold uppercase text-blue-800">
                    {trainer.name}
                  </p>
                  <p className="capitalize">{trainer.title}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="review" className="py-16 bg-gray-900">
        <div className="container">
          <h2 className="text-3xl font-bold uppercase text-center mb-12 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-blue-400 pb-2">
            Quelques commentaires
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="bg-transparent border-none text-center"
              >
                <CardContent className="flex flex-col items-center">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-24 h-24 rounded-full object-cover mb-6"
                  />
                  <blockquote className="relative">
                    <p className="italic mb-6 text-gray-300">{review.text}</p>
                    <div className="font-bold uppercase tracking-wider text-blue-600">
                      {review.name}
                    </div>
                    <div className="absolute -top-16 -left-4 text-9xl text-blue-700 opacity-50">
                      "
                    </div>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Login Section */}
      <section
        id="contact"
        className="py-16 bg-black flex items-center justify-center"
      >
        <SignIn
          routing="hash"
          appearance={{
            variables: {
              colorBackground: "black",
              colorText: "white",
            },
          }}
        />
      </section>

      {/* Footer */}
      <footer className="md:py-16 bg-black p-4 py-12 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">
              <span className="text-blue-400">M</span>Fitness
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                100 Nallin Street, New York
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                +00 000 000 00
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                MFitness@domine.com
              </li>
              <li className="flex items-center space-x-3 mt-4">
                {[
                  <Signal size={24} />,
                  <Facebook size={24} />,
                  <Instagram size={24} />,
                  <Twitter size={24} />,
                ].map((social, i) => (
                  <a key={i} href="#" className="hover:opacity-80">
                    {social}
                  </a>
                ))}
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start justify-start">
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 flex items-center justify-center flex-col">
              {navLinks.map((link) => (
                <li key={link.name} className="w-full md:w-fit">
                  <a
                    href={link.href}
                    className="flex items-center hover:text-blue-400 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .clip-path-branch {
          clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
}
