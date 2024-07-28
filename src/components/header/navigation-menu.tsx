import * as React from "react";
import { Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "../ui/separator";
import { MENU_DATA } from "@/data/_header-navigation-menu-options";

const NavigationMenuWrapper: React.FunctionComponent = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Text to Speech</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[680px] lg:grid-cols-[.90fr_1fr]">
              <li className="row-span-2">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <img src="/vector.svg" alt="Logo" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Voicenator
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Listen to anything with AI Voices.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li className="block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <NavigationMenuLink asChild>
                  <Link to={"/text-to-speech"}>
                    <div className="flex items-start gap-3">
                      <img
                        src={"/icon.svg"}
                        alt="Text to Speech"
                        className="h-14"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none">
                          Text to Speech
                        </h4>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Listen & organize your files in your browser
                        </p>
                      </div>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <NavigationMenuLink asChild>
                  <Link to={"pdf-reader"}>
                    <div className="flex items-start gap-3">
                      <img
                        src={"/assets/pdf-reader.svg"}
                        alt="PDF Reader"
                        className="h-14"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none">
                          PDF Reader
                        </h4>
                        <p className="text-sm leading-snug text-muted-foreground">
                          A PDF Reader that Reads Out Loud
                        </p>
                      </div>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
            <div className="bg-muted">
              <Separator className="w-full" />
              <ul className="flex items-center p-3">
                {MENU_DATA.textToSpeech.map((data) => (
                  <li key={data.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        to={data.href}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={data.icon}
                            alt={data.title}
                            className="h-14"
                          />
                          <div className="space-y-1">
                            <h4 className="text-base font-medium leading-none">
                              {data.title}
                            </h4>
                            <p className="text-sm leading-snug text-muted-foreground">
                              {data.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>AI Voice Generator</NavigationMenuTrigger>
          <NavigationMenuContent className="space-y-3">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[700px]">
              {MENU_DATA.aiVoiceGenerator.map((data) => (
                <li key={data.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      to={data.href}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={data.icon}
                          alt={data.title}
                          className="h-14"
                        />
                        <div className="space-y-1">
                          <h4 className="text-base font-medium leading-none">
                            {data.title}
                          </h4>
                          <p className="text-sm leading-snug text-muted-foreground">
                            {data.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
            <div className="bg-muted">
              <Separator className="w-full" />
              <li className="block select-none space-y-1 rounded-xl p-6 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <NavigationMenuLink asChild>
                  <Link to={"/voiceover-studio"}>
                    <div className="flex items-start gap-3">
                      <img
                        src={"/assets/vo-bussiness-nav-icon.svg"}
                        alt="Voice Over Studio for Business"
                        className="h-14"
                      />
                      <div className="space-y-1">
                        <h4 className="text-base font-medium leading-none">
                          Voice Over Studio for Business
                        </h4>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Talk to sales & request a free demo.
                        </p>
                      </div>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Teams</NavigationMenuTrigger>
          <NavigationMenuContent className="space-y-3 p-4">
            <h3>SMBs to Enterprise</h3>
            <ul className="grid w-[350px] gap-3 md:w-[350px] lg:w-[350px]">
              {MENU_DATA.teams.map((data) => (
                <li key={data.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      to={data.href}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={data.icon}
                          alt={data.title}
                          className="h-10"
                        />
                        <h4 className="text-base font-medium leading-none">
                          {data.title}
                        </h4>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Education</NavigationMenuTrigger>
          <NavigationMenuContent className="space-y-3 p-4">
            <h3>For Administrators & Teachers</h3>
            <ul className="grid w-[400px] gap-3 md:w-[400px] lg:w-[450px]">
              {MENU_DATA.education.map((data) => (
                <li key={data.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      to={data.href}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={data.icon}
                          alt={data.title}
                          className="h-10"
                        />
                        <h4 className="text-base font-medium">{data.title}</h4>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMenuWrapper;
