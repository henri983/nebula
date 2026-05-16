import JSZip from 'jszip';

export interface WhatsAppMessage {
  date: string;
  time: string;
  sender: string;
  content: string;
  mediaName?: string;
  mediaUrl?: string;
}

export const revokeMediaUrls = (messages: WhatsAppMessage[]) => {
  messages.forEach(msg => {
    if (msg.mediaUrl) {
      URL.revokeObjectURL(msg.mediaUrl);
    }
  });
};

export const parseWhatsAppExport = async (zipFile: File): Promise<WhatsAppMessage[]> => {
  const zip = await JSZip.loadAsync(zipFile);
  
  // Trouver le fichier texte (généralement _chat.txt ou [Nom de la discussion].txt)
  const chatFile = Object.values(zip.files).find(f => f.name.endsWith('.txt') && !f.name.startsWith('__MACOSX'));
  
  if (!chatFile) {
    throw new Error("Fichier de discussion (.txt) non trouvé dans l'archive.");
  }

  const text = await chatFile.async('string');
  const messages: WhatsAppMessage[] = [];
  
  // Regex pour différents formats (Android, iOS)
  // Format iOS: [dd/mm/yyyy hh:mm:ss] Nom: Message
  // Format Android: dd/mm/yyyy, hh:mm - Nom: Message
  const lines = text.split('\n');
  
  // On va stocker les URLs des médias pour éviter de les recréer
  const mediaCache: Record<string, string> = {};

  for (const line of lines) {
    if (!line.trim()) continue;

    // Regex Universelle encore plus permissive
    // Groupe 1: Date, Groupe 2: Heure (incluant AM/PM), Groupe 3: Expéditeur, Groupe 4: Message
    // Supporte:
    // [15/05/2026, 14:30:05] John Doe: Hello
    // 15/05/2026, 2:30 PM - John Doe: Hello
    // 5/15/26, 14:30 - John Doe: Hello
    const universalMatch = line.match(/^\[?(\d{1,2}\/\d{1,2}\/\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AaPp][Mm])?)\]?[\s-]*[:-]?\s*([^:]+):\s+(.*)$/);

    if (universalMatch) {
      const [, date, time, sender, content] = universalMatch;
      
      // Ignorer les messages système (ex: "Les messages sont chiffrés", "Vous avez changé le logo")
      if (content.includes("chiffrés de bout en bout") || content.includes("end-to-end encrypted")) {
        continue;
      }

      const message: WhatsAppMessage = { date, time, sender, content };

      // Détecter si le contenu indique un média
      // iOS: <Pièce jointe : photo.jpg>
      // Android: photo.jpg (fichier joint)
      const mediaMatch = content.match(/<Pièce jointe : (.*?)>|(.*?) \(fichier joint\)/);
      const mediaName = mediaMatch ? (mediaMatch[1] || mediaMatch[2]) : null;

      if (mediaName) {
        message.mediaName = mediaName.trim();
        
        // Chercher le fichier dans le ZIP
        const foundMedia = Object.values(zip.files).find(f => f.name.includes(message.mediaName!));
        if (foundMedia) {
          if (!mediaCache[foundMedia.name]) {
            const blob = await foundMedia.async('blob');
            mediaCache[foundMedia.name] = URL.createObjectURL(blob);
          }
          message.mediaUrl = mediaCache[foundMedia.name];
        }
      }

      messages.push(message);
    } else if (messages.length > 0) {
      // Suite du message précédent (multi-ligne)
      messages[messages.length - 1].content += '\n' + line;
    }
  }

  return messages;
};
