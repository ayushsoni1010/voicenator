// import React from "react";
// import { useSpeech } from "@/hooks/useSpeech";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// const FormSchema = z.object({
//   text: z.string().min(1, "Required"),
// });

// const Controls: React.FunctionComponent = () => {
//   const [text, setText] = useState<string>("");
//   //   const {
//   //     // currentSentenceIdx,
//   //     // currentWordRange,
//   //     playState,
//   //     currentSentence,
//   //     currentWord,
//   //     play,
//   //     pause,
//   //     resume,
//   //     cancel,
//   //   } = useSpeech(text);

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       text: "",
//     },
//   });

//   function onSubmit(values: z.infer<typeof FormSchema>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values)
//   }

//   return (
//     <div>
//       <h1 className="text-2xl">Controls</h1>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={form.control}
//             name="text"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Username</FormLabel>
//                 <FormControl>
//                   <Input placeholder="shadcn" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   This is your public display name.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

import React, { useState } from "react";
import { useSpeech } from "@/hooks/useSpeech"; 
import { SpeechEnginePlayState } from "@/types/speech";

const SpeechComponent: React.FC = () => {
  const [text, setText] = useState("");
  const {
    currentSentenceIdx,
    currentWordRange,
    playState,
    currentSentence,
    currentWord,
    play,
    pause,
    resume,
    cancel,
  } = useSpeech(text);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handlePlayPause = () => {
    if (playState === SpeechEnginePlayState.PLAYING) {
      pause();
    } else if (playState === SpeechEnginePlayState.PAUSED) {
      resume();
    } else {
      play();
    }
  };

  const getHighlightedText = (
    text: string,
    currentWordRange: [number, number]
  ) => {
    const [start, end] = currentWordRange;
    if (start === end) return text;

    return (
      <span>
        {text.substring(0, start)}
        <span style={{ backgroundColor: "yellow" }}>
          {text.substring(start, end)}
        </span>
        {text.substring(end)}
      </span>
    );
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text here..."
        rows={5}
        cols={50}
      />
      <div>
        <button onClick={handlePlayPause}>
          {playState === SpeechEnginePlayState.PLAYING
            ? "Pause"
            : playState === SpeechEnginePlayState.PAUSED
            ? "Resume"
            : "Play"}
        </button>
        <button onClick={cancel}>Cancel</button>
      </div>
      <div>
        <h3>Text:</h3>
        <p>{getHighlightedText(text, currentWordRange)}</p>
      </div>
    </div>
  );
};

export default SpeechComponent;
