"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AIDoctorAgents } from "../../../../shared/list";

function AddNewSessionDialog() {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  const router = useRouter();

  // ============================================
  // START CONSULTATION
  // ============================================
  const OnClickStart = async () => {
    console.log("🚀 Start Consultation Clicked");

    if (!selectedDoctorId || !suggestions) {
      console.warn("⚠️ No doctor selected");
      return;
    }

    const selectedDoctor = suggestions.find(
      (doc) => doc.id === selectedDoctorId
    );

    console.log("👨‍⚕️ Selected Doctor:", selectedDoctor);

    if (!selectedDoctor) {
      setError("Doctor not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("📡 Sending session-chat request...");

      const result = await axios.post(
        "/api/users/session-chat",
        {
          notes: note,
          selectedDoctor,
          allSuggestions: suggestions,
        }
      );

      console.log("🔥 SESSION API RESPONSE:", result);

      const sessionId =
        result.data?.session_id ||
        result.data?.[0]?.session_id;

      console.log("🆔 Session ID:", sessionId);

      if (sessionId) {
        router.push(
          `/dashboard/medical-agent/${sessionId}`
        );

        setNote("");
        setSuggestions(null);
        setSelectedDoctorId(null);
      } else {
        setError("Session ID not found");
      }
    } catch (err) {
      console.error(
        "❌ API error in /api/users/session-chat:",
        err
      );

      setError("Failed to start consultation");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SUGGEST DOCTORS
  // ============================================
  const OnSuggestDoctors = async () => {
    console.log("🔍 Suggest Doctors Clicked");
    console.log("📝 Note:", note);

    setLoading(true);
    setError(null);
    setSuggestions(null);
    setSelectedDoctorId(null);

    try {
      console.log(
        "📡 Sending request to /api/users/suggest-doctors..."
      );

      const result = await axios.post(
        "/api/users/suggest-doctors",
        {
          notes: note,
        }
      );

      console.log("🔥 FULL API RESPONSE:", result);

      console.log(
        "✅ Suggest-doctors API response:",
        result.data
      );

      const raw = result.data?.rawResp;

      console.log("🧠 Raw AI Response:", raw);

      if (!raw) {
        throw new Error("No AI response received");
      }

      // ============================================
      // EXTRACT JSON
      // ============================================
      const start = raw.indexOf("{");

      let open = 0;
      let end = -1;

      for (let i = start; i < raw.length; i++) {
        if (raw[i] === "{") open++;
        else if (raw[i] === "}") open--;

        if (open === 0) {
          end = i;
          break;
        }
      }

      const jsonStr = raw.slice(start, end + 1);

      console.log("📜 Extracted JSON:", jsonStr);

      const extracted = JSON.parse(jsonStr);

      console.log("✅ Parsed JSON:", extracted);

      if (!extracted?.suggested_doctors) {
        throw new Error("No suggested doctors found");
      }

      // ============================================
      // ENRICH DOCTOR DATA
      // ============================================
      const enrichedDoctors =
        extracted.suggested_doctors.map(
          (doc: any) => {
            const match = AIDoctorAgents.find(
              (d) => d.id === doc.id
            );

            return {
              ...doc,
              name:
                match?.specialist ||
                doc.specialist,

              image:
                match?.image ||
                "/default-doctor.png",

              description:
                match?.description ||
                `${doc.specialist} Specialist`,

              voiceId: match?.voiceId,

              agentPrompt:
                match?.agentPrompt,

              subscriptionRequired:
                match?.subscriptionRequired ??
                false,
            };
          }
        );

      console.log(
        "🎯 FINAL ENRICHED DOCTORS:",
        enrichedDoctors
      );

      setSuggestions(enrichedDoctors);
    } catch (err) {
      console.error(
        "❌ API error in /api/users/suggest-doctors:",
        err
      );

      setError("Failed to suggest doctors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3">
          + Start Consultation
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Basic Details
          </DialogTitle>

          <DialogDescription>
            Please provide symptoms or details.
          </DialogDescription>
        </DialogHeader>

        {/* TEXTAREA */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">
            Symptoms / Details
          </h2>

          <Textarea
            placeholder="Add detail here..."
            className="w-full min-h-[120px]"
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 mt-2">
            {error}
          </p>
        )}

        {/* SUGGESTIONS */}
        {suggestions && (
          <div className="mt-4 bg-gray-100 p-3 rounded">
            <h3 className="font-semibold mb-2">
              Suggested Doctors
            </h3>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {suggestions.map((doc) => (
                <li
                  key={doc.id}
                  className={`flex items-start gap-4 p-3 rounded border shadow transition ${
                    selectedDoctorId === doc.id
                      ? "border-blue-500 bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <img
                    src={
                      doc.image ||
                      "/default-doctor.png"
                    }
                    alt={doc.specialist}
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  <div className="flex-1">
                    <p className="font-bold text-sm">
                      {doc.specialist}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {doc.description}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={
                      selectedDoctorId === doc.id
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      console.log(
                        "👆 Selected doctor:",
                        doc
                      );

                      setSelectedDoctorId(doc.id);
                    }}
                  >
                    {selectedDoctorId === doc.id
                      ? "Selected"
                      : "Select"}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FOOTER */}
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button
              className="bg-white text-black border border-black"
            >
              Cancel
            </Button>
          </DialogClose>

          {!suggestions ? (
            <Button
              disabled={!note || loading}
              onClick={OnSuggestDoctors}
            >
              {loading
                ? "Loading..."
                : "Suggest"}
            </Button>
          ) : (
            <Button
              disabled={
                !selectedDoctorId || loading
              }
              onClick={OnClickStart}
            >
              {loading
                ? "Starting..."
                : "Start"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;