import type { WhatsAppMessage } from './whatsappParser';

export interface ChatAnalytics {
  totalMessages: number;
  participants: {
    name: string;
    count: number;
    mediaCount: number;
    photoCount: number;
    videoCount: number;
    audioCount: number;
    linkCount: number;
    avgResponseTime: number; 
    deletedCount: number;
    avgMessageLength: number;
    laughCount: number;
  }[];
  topEmojis: { emoji: string; count: number }[];
  hourlyActivity: number[]; 
  weeklyActivity: number[]; 
  totalMedia: number;
  totalPhotos: number;
  totalVideos: number;
  totalAudios: number;
  totalLinks: number;
  totalDeleted: number;
  firstMessage: string;
  lastMessage: string;
  mostActiveDate: { date: string; count: number };
  longestStreak: number;
  totalWords: number;
  topParticipant: string;
  activityProfile: string;
}

export const analyzeChat = (messages: WhatsAppMessage[]): ChatAnalytics => {
  const stats: ChatAnalytics = {
    totalMessages: messages.length,
    participants: [],
    topEmojis: [],
    hourlyActivity: new Array(24).fill(0),
    weeklyActivity: new Array(7).fill(0),
    totalMedia: 0,
    totalPhotos: 0,
    totalVideos: 0,
    totalAudios: 0,
    totalLinks: 0,
    totalDeleted: 0,
    firstMessage: messages[0]?.date || "",
    lastMessage: messages[messages.length - 1]?.date || "",
    mostActiveDate: { date: "", count: 0 },
    longestStreak: 0,
    totalWords: 0,
    topParticipant: "",
    activityProfile: "",
  };

  const participantData: Record<string, { 
    count: number; 
    media: number; 
    photos: number;
    videos: number;
    audios: number;
    links: number;
    deleted: number;
    totalChars: number;
    laugh: number;
    responseTimes: number[];
  }> = {};

  const dailyCounts: Record<string, number> = {};
  const laughRegex = /ha(ha)+|lo+l|mdr+|ptdr+|😂|🤣|😆/gi;
  const linkRegex = /https?:\/\/[^\s]+/gi;
  const emojiMap: Record<string, number> = {};
  const emojiRegex = /\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;

  messages.forEach((msg, index) => {
    if (!participantData[msg.sender]) {
      participantData[msg.sender] = { count: 0, media: 0, photos: 0, videos: 0, audios: 0, links: 0, deleted: 0, totalChars: 0, laugh: 0, responseTimes: [] };
    }
    const p = participantData[msg.sender];
    p.count++;
    p.totalChars += msg.content.length;
    stats.totalWords += msg.content.trim().split(/\s+/).length;

    // Analyse des liens
    const links = msg.content.match(linkRegex);
    if (links) {
      p.links += links.length;
      stats.totalLinks += links.length;
    }

    // Détection du rire
    const laughs = msg.content.match(laughRegex);
    if (laughs) p.laugh += laughs.length;

    // Analyse temporelle
    try {
      const [d, m, y] = msg.date.split('/').map(Number);
      const hourPart = msg.time.split(' ')[0];
      let [hh] = hourPart.split(':').map(Number);
      if (msg.time.toLowerCase().includes('pm') && hh < 12) hh += 12;
      if (msg.time.toLowerCase().includes('am') && hh === 12) hh = 0;
      if (!isNaN(hh)) stats.hourlyActivity[hh]++;
      
      const dateKey = `${d}/${m}/${y}`;
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;

      const dateObj = new Date(y < 100 ? 2000 + y : y, m - 1, d);
      if (!isNaN(dateObj.getTime())) stats.weeklyActivity[dateObj.getDay()]++;
    } catch { /* skip */ }

    // Analyse Média Détailée
    if (msg.mediaName) {
      p.media++;
      stats.totalMedia++;
      const ext = msg.mediaName.split('.').pop()?.toLowerCase() || "";
      
      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'].includes(ext)) {
        p.photos++; stats.totalPhotos++;
      } else if (['mp4', 'mov', '3gp', 'mkv', 'avi'].includes(ext)) {
        p.videos++; stats.totalVideos++;
      } else if (['opus', 'wav', 'mp3', 'm4a', 'ogg'].includes(ext)) {
        p.audios++; stats.totalAudios++;
      }
    }

    const deletedMarkers = ["Ce message a été supprimé", "You deleted this message", "This message was deleted", "Mensaje eliminado"];
    if (deletedMarkers.some(marker => msg.content.includes(marker))) {
      p.deleted++;
      stats.totalDeleted++;
    }

    const emojis = msg.content.match(emojiRegex);
    if (emojis) emojis.forEach(e => emojiMap[e] = (emojiMap[e] || 0) + 1);

    if (index > 0 && messages[index - 1].sender !== msg.sender) {
      try {
        const parseDate = (dStr: string, tStr: string) => {
          const [d, m, y] = dStr.split('/').map(Number);
          const tPart = tStr.split(' ')[0];
          let [hh, mm] = tPart.split(':').map(Number);
          if (tStr.toLowerCase().includes('pm') && hh < 12) hh += 12;
          if (tStr.toLowerCase().includes('am') && hh === 12) hh = 0;
          return new Date(y < 100 ? 2000 + y : y, m - 1, d, hh, mm).getTime();
        };
        const diff = (parseDate(msg.date, msg.time) - parseDate(messages[index-1].date, messages[index-1].time)) / 1000;
        if (diff > 0 && diff < 43200) p.responseTimes.push(diff);
      } catch { /* skip */ }
    }
  });

  // Calcul du jour le plus actif
  let maxDayCount = 0;
  let maxDayDate = "";
  Object.entries(dailyCounts).forEach(([date, count]) => {
    if (count > maxDayCount) { maxDayCount = count; maxDayDate = date; }
  });
  stats.mostActiveDate = { date: maxDayDate, count: maxDayCount };

  // Calcul de la plus longue série (Streak)
  const sortedDates = Object.keys(dailyCounts).map(d => {
    const [dd, mm, yy] = d.split('/').map(Number);
    return new Date(yy < 100 ? 2000 + yy : yy, mm - 1, dd).getTime();
  }).sort((a, b) => a - b);

  let currentStreak = 0;
  let maxStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i > 0 && sortedDates[i] - sortedDates[i-1] <= 86400000 + 3600000) { 
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;
  }
  stats.longestStreak = maxStreak;

  // Profil d'activité
  const nightMsgs = stats.hourlyActivity.slice(0, 6).reduce((a, b) => a + b, 0);
  const dayMsgs = stats.hourlyActivity.slice(9, 18).reduce((a, b) => a + b, 0);
  stats.activityProfile = nightMsgs > dayMsgs ? "OISEAU DE NUIT" : "LÈVE-TÔT";

  stats.participants = Object.entries(participantData).map(([name, data]) => ({
    name,
    count: data.count,
    mediaCount: data.media,
    photoCount: data.photos,
    videoCount: data.videos,
    audioCount: data.audios,
    linkCount: data.links,
    deletedCount: data.deleted,
    laughCount: data.laugh,
    avgMessageLength: Math.round(data.totalChars / (data.count || 1)),
    avgResponseTime: data.responseTimes.length > 0 
      ? data.responseTimes.reduce((a, b) => a + b, 0) / data.responseTimes.length 
      : 0
  })).sort((a, b) => b.count - a.count);

  stats.topParticipant = stats.participants[0]?.name || "";
  stats.topEmojis = Object.entries(emojiMap).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([emoji, count]) => ({ emoji, count }));

  return stats;
};



