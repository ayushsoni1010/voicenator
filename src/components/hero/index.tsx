import React from "react";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import Header from "../header";

const Hero: React.FunctionComponent = () => {
  return (
    <main className="min-h-screen max-w-screen-2xl m-auto">
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-2 gap-10">
          <img
            src="/assets/mockup.png"
            alt="Mockup"
            className="h-[37rem] object-cover"
            loading="lazy"
          />
          <div className="flex flex-col gap-10 items-center mx-auto max-w-[35rem]">
            <h1 className=" font-extrabold text-4xl leading-tight">
              Cut Your Reading Time in Half. Let Voicenator Read to You.
            </h1>
            <div>
              <Card>
                <CardHeader>
                    
                </CardHeader>
              </Card>
            </div>
            <Button className="w-full" size="lg">
              Try for free
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
