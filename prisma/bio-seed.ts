import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

const bios: Record<string, string> = {
  Terunofuji:
    "He fell from the heavens and climbed back up. Born on the Mongolian steppe, Gantulgyn Gan-Erdene arrived in Japan and rose to ōzeki before his knees and body gave out beneath him — diabetes, torn ligaments, a champion unmade at his peak. He slipped all the way to sumo's third division, a former champion fighting unknown teenagers while the sport held its breath. But he returned, bout by bout, and became the 73rd yokozuna — the greatest comeback the sport has ever witnessed — carrying that throne until January 2025, when he set down his mawashi with eight championships and a legacy no injury could erase.",

  Hoshoryu:
    "The nephew of the ferocious Asashōryū carries that bloodline like a live current. Byambasuren Sugarragchaagiin was born in Ulaanbaatar watching his uncle electrify the dohyo, and he arrived in Japan with the same dangerous ambition. He reached ōzeki in his mid-twenties on a style built on balance, timing, and throws that left opponents horizontal before they understood what happened. He won his first championship in July 2023, and by January 2025 — after a second title — became sumo's 74th yokozuna, the sport's new sovereign and its most exciting wrestler in a generation.",

  Kirishima:
    "Byambachuluun Lkhagvasuren left Mongolia as a teenager to follow sumo's ancient call, and spent years quietly becoming one of the sport's most complete technicians. He wrestled under the name Kiribayama before his stablemaster — himself a former champion who once bore the historic Kirishima name — passed it to him upon his promotion to ōzeki in May 2023. He won the Emperor's Cup in November 2023, and after a brief demotion reclaimed his ōzeki rank with another championship in March 2026. A beautifully orthodox belt wrestler, he is the kind of rikishi who makes difficult sumo look inevitable.",

  Kotozakura:
    "Sumo runs in his blood three generations deep. Masakatsu Kamatani is the grandson of the 52nd yokozuna Kotozakura and the son of sekiwake Kotonowaka, and has wrestled his entire life inside Sadogatake stable — the family's house. He reached ōzeki in January 2024 and claimed the Kotozakura ring name for the first time in fifty years, a title freighted with dynasty. He won his first championship in November 2024, the latest flowering of a sumo lineage that has shaped the sport for decades.",

  Onosato:
    "He arrived in professional sumo in May 2023 and barely slowed down long enough to look behind him. Born in Tsubata, Ishikawa, Daiki Nakamura had already won national amateur titles before stepping onto the professional dohyo, and he rose to yokozuna in just 13 tournaments — the fastest ascent in the post-war era. Clean technique, physical authority, and an unnerving composure in big moments made him the 75th yokozuna by May 2025. In a sport that moves slowly, Onosato moved like thunder.",

  Atamifuji:
    "He began sumo at age six in Mishima, a small city tucked between Atami and the shadow of Mount Fuji, and his ring name maps that geography like a birthmark. Sakutaro Takei joined Isegahama stable as a teenager and swept through the lower divisions like a tide — reaching makuuchi in November 2022, one of the fastest ascents in sumo history. By March 2026 he had been promoted to komusubi, the first wrestler from Shizuoka Prefecture to reach san'yaku in 96 years. He is 23 years old and still becoming.",

  Gonoyama:
    "Toki Nishikawa chose the slower road — four years of university law before trading the lecture hall for the dohyo. He joined Takekuma stable in 2021 and reached the top division in July 2023, then announced himself in November with back-to-back upsets of ōzeki in consecutive days. He wrestles with the cool precision of someone who planned for the long game, and the top division is only the beginning of what he has in mind.",

  Daieisho:
    "Born in Saitama's suburban sprawl, Hayato Takanishi built himself into a wrecking ball. His tsuppari — percussive double-arm thrusts that keep opponents off balance and gasping — is one of the most feared weapons in the sport. He reached sekiwake and won his first Emperor's Cup in January 2021, going 13–2 in a tournament where few could stay in front of him for long. He has since collected a fistful of kinboshi from defeated yokozuna, and remains one of makuuchi's most relentless presences.",

  Takakeisho:
    "He fought with a low centre of gravity and a high tolerance for being underestimated, and for a while it was enough to make him one of the most dangerous wrestlers alive. Takanobu Sato's signature double-hand thrusts earned him four Emperor's Cups and the rank of ōzeki, and he made it look like physics rather than effort. Injuries finally undid what opponents could not, and he retired after September 2024, leaving behind a style so distinctive it existed in a category of its own.",

  Tobizaru:
    "His name means Flying Monkey, chosen for the year of his birth and the darting, barely-there quality of his sumo. Masaya Iwasaki is slight by the sport's standards — 175 cm, built for speed rather than mass — but he has made the biggest wrestlers in the world look foolish with slaps, pivots, and sidesteps they never saw coming. He reached the top division in September 2020 and nearly won the championship in his very first tournament there. Nobody in sumo is more fun to watch, and nobody is harder to grab.",

  Nishikigi:
    "Tetsuya Kumagai began his professional career in 2006 as a teenager, and spent the next seventeen years in sumo's grinding lower divisions, barely noticed by the sport's wider audience. He needed 103 tournaments to reach the san'yaku rank of komusubi — the third-slowest such progression in recorded history. He wears thick glasses off the dohyo; on it, he is immovable, a belt wrestler whose tenacity looks less like technique and more like stubbornness weaponized. When he finally reached komusubi in September 2023, it felt like watching a tide arrive that nobody believed would ever come in.",

  Midorifuji:
    "He dropped out of university and joined Isegahama stable on instinct, too restless to finish a degree and too talented to stay away from the dohyo. Kazunari Ihara is lighter than almost every wrestler he faces, which means he has had to become smarter than all of them — mastering rare, technical kimarite like the katasukashi that most rikishi never attempt. He reached the top division in January 2021 after winning the jūryō championship, and has since proven that in sumo, technique outlasts size.",

  Abi:
    "His mentor, the retired sekiwake Terao, watched the young Kosuke Horikiri and saw something worth naming — enrolling him in his stable and giving him a ring name to carry. Abi became known for a pushing style so distinctive it was nicknamed 'Abi-zumo' by fans: arms out wide, double-hand thrusts, relentless forward pressure. A COVID protocol suspension in 2020 threatened to end his career; instead it humbled him, and he returned to win his first championship in November 2022, a comeback that felt earned in every step.",

  Kotoshoho:
    "Toshiki Tebakari grew up in Kashiwa and joined Sadogatake stable as a teenager, wrestling in the shadow of future ōzeki Kotozakura while quietly carving his own path. He reached the top division in May 2020 and spent years learning its rhythms — losing, adapting, returning tougher. In July 2025 he won his first Emperor's Cup with a 13–2 record, defeating the newly promoted yokozuna Onosato along the way. The belt, when it finally arrived, fit like it had always been waiting.",

  Shonannoumi:
    "His name is the coast — Shōnan, the sun-washed stretch of Kanagawa shore where the Pacific rolls in slow and steady — and he carries that geography with quiet pride. He made his professional debut in 2014 but spent nine patient years in the lower divisions before finally reaching sekitori status, then the top makuuchi division in July 2023. The long road made him grateful, and the gratitude shows in how he fights: forward, committed, nothing held back.",

  Roga:
    "He is a wrestler without a simple answer. Born in Kyzyl, Russia, to a Buryat father and a Tuvan mother, Amartuvshin Amarsanaa moved to Mongolia at 14, adopted Mongolian citizenship, and eventually found his way into Japan through Futagoyama stable. When he reached the top makuuchi division in November 2023 he became the first Russian-born wrestler in the elite tier in nine years, a reminder that sumo, for all its ancient ceremony, is assembled from the furthest corners of the world.",

  Takanosho:
    "Nobuaki Ishii began professional sumo at 15 and has been building, quietly and without flourish, for fifteen years since. He fights with an oshi specialist's directness — push them out, push them down, no detours — and reached sekiwake through sheer accumulation of well-executed sumo. Three kinboshi for yokozuna upsets mark the peaks of a career defined less by drama than by the kind of steady excellence that is easy to underestimate but impossible to ignore.",

  Wakamotoharu:
    "He is the middle son of three brothers who all wrestle under the same shikona prefix, grandsons of a former komusubi, and their story is one of shared devotion to a sport that rarely rewards families the way it has rewarded theirs. Minato Onami joined Arashio stable and climbed methodically, winning the makushita championship in January 2019 before reaching the top division and eventually sekiwake in May 2023. When he and his brother Wakatakakage both held sekiwake simultaneously, they became only the fourth sibling pair in history to share that rank.",

  Hiradoumi:
    "He began sumo at Himosashi Elementary School in Hirado, a small city at the tip of Nagasaki that almost nobody outside Japan could find on a map, guided by a former wrestler from the same streets. Yuki Sakaguchi joined Sakaigawa stable and made the top division in July 2022 — the first wrestler from Nagasaki in eleven years. He reached komusubi on the back of victories over ōzeki and yokozuna, and each time he enters the dohyo he carries a city with him.",

  Kinbozan:
    "Yersin Baltagul grew up practising judo and Kazakh wrestling in Almaty, and might never have found sumo at all if not for former yokozuna Asashōryū, who spotted him competing and pointed him toward Japan. He enrolled at Nihon University, finished runner-up in the All-Japan Championships in 2019, and turned professional in November 2021. By March 2023 he had reached the top division, becoming the first Kazakhstani to do so, and brought with him a physical directness that is slowly, visibly being replaced by mastery.",

  Takarafuji:
    "He came to Isegahama stable at the invitation of a legendary alumnus, and spent fifteen years as one of sumo's most dependable inhabitants — smooth, technical, never hurried, never absent. Daisuke Sugiyama reached sekiwake and built a reputation for yotsu-grappling of uncommon elegance, winning through mechanics rather than force. After fifteen consecutive years as a salaried sekitori without a single missed bout in his prime, he finally withdrew from the top division in 2025, leaving behind a body of work that was never spectacular and never needed to be.",

  Meisei:
    "He grew up on Amami Ōshima, a subtropical island in the far south of Kagoshima where sumo is part of the landscape, and joined Tatsunami stable at 15 rather than continuing his education, following the dohyo the way some people follow a calling. Meisei Kawabata reached the top division in July 2018 and made history for his stable in 2021 — the first Tatsunami wrestler to reach komusubi since 1994, and then sekiwake since 1985. He is a belt wrestler with a patient, deliberate style, and a career that has quietly exceeded almost every expectation.",

  Endo:
    "The people of Anamizu, Ishikawa, knew he was different before sumo did. Shōta Endō won national amateur championships and turned professional in March 2013 at the rarely granted elevated entry rank, becoming one of the most beloved rikishi of his generation — his face as recognizable outside the arena as inside it. He reached komusubi, won multiple special prizes, and for a period in his prime was the wrestler every young Japanese fan wanted to be. He represents Oitekaze stable, the house built by a wrestler from his own hometown.",

  Mitakeumi:
    "He is from the mountains of Nagano, born on Christmas Day, the son of a Japanese father and a Filipino mother, and he fought his way out of the high country to become an ōzeki for the first time in 227 years from his prefecture. Hisashi Omichi was an amateur champion at Toyo University before joining Dewanoumi stable and reaching the top division in late 2015. He won three championships from the sekiwake rank before promotion to ōzeki in January 2022 — then held the rank for just four tournaments. The mountain gives and takes.",

  Tamawashi:
    "He stumbled into sumo. Batjargal Munkh-Orgil came to Japan to visit his sister, walked past a sumo stable in Ryōgoku on a whim, and ended up recruited. He joined Kataonami stable and built himself into a push-and-thrust specialist of rare purity — roughly half his career victories have come by pushing his opponent straight out, no tricks, no grappling, just force applied in a direct line. He obtained Japanese citizenship in March 2024 to secure a coaching future, and as of early 2026 remains the oldest active wrestler in the top division at 41, still walking forward.",

  Nishikifuji:
    "His mother put him in sumo as a boy, and he never found a reason to leave. Ryusei Ogasawara grew up in Towada, in the cold north of Aomori, and trained alongside future stable-mate Midorifuji at university before both dropped out and joined Isegahama stable together in 2016. He won the jūryō championship in May 2022 and reached the top division with an immediate 10–5 record, making the transition look like something he had been rehearsing quietly for years.",

  Sadanoumi:
    "His father wrestled professionally under the same name, and when Kaname Matsumura joined the sport at 15, the shikona was already waiting for him. He spent eleven years rising through sumo's divisions — patient, methodical, unhurried — before reaching the top makuuchi tier in 2014. In May 2024 he recorded his 700th career victory, placing him among the most prolific winners still competing at sumo's highest level. He does not make headlines; he makes records.",

  Ichiyamamoto:
    "Daiki Yamamoto is from Iwanai, on Hokkaido's western coast where winter lasts half the year and the cold either makes you or sends you south. He chose sumo, joined Nishonoseki stable after university, and reached the top division in July 2021 by accumulating wins the old-fashioned way — pushing forward, trusting his technique, never overthinking. He reached maegashira 1, and in a sport full of gravity, he fights like a man who believes the problem is always directly in front of him.",

  Hokutofuji:
    "He was a high school yokozuna in Saitama, an amateur champion at university, and arrived in professional sumo in 2015 trailing a reputation that the top division quickly tested. Daiki Nakamura reached makuuchi in November 2016 and built his career on explosive forward sumo — feet driving, shoulders low, going straight through whatever stood between him and the edge of the ring. Seven kinboshi for yokozuna upsets mark the heights of what he achieved; he retired in May 2025 having given the sport everything his body had to offer.",

  Myogiryu:
    "They called him '22' because of the remarkable body fat figure he maintained through a career built entirely on leverage and skill in a sport that mostly runs on mass. Yasunari Miyamoto reached sekiwake and earned six kinboshi, most memorably defeating the great Hakuhō in January 2013 in a result that felt like a small act of beautiful defiance. He retired in September 2024 with no regrets, he said — having competed until the very end, which is the only way he knew how to do anything.",

  Oho:
    "The weight of inheritance settles on him differently than it does on most. Konosuke Naya is the grandson of the great 48th yokozuna Taihō — arguably the finest sumo wrestler who ever lived — and the son of former sekiwake Takatōriki, and the expectations that come with that bloodline have never been anything but enormous. He joined Otake stable and reached the top division in January 2022, flashing the technique his family is known for in moments that remind you exactly why the name matters. He is still young enough that the story has not yet been written.",

  Asanoyama:
    "He won the May 2019 championship and received a trophy from a sitting US president, and then spent the next two years losing almost everything else. A suspension for violating COVID protocols sent Hiroki Ishibashi from ōzeki all the way to the sport's third division — a fall that would have ended most careers. It did not end his. He returned, won the jūryō championship in January 2023, and climbed back to the top division by May. A torn ACL in July 2024 delayed him again, but the pattern of his career is clear: he always comes back.",

  Aoiyama:
    "He found sumo by accident. Daniel Ivanov, born in Elhovo, Bulgaria, followed a countryman's invitation to Japan and discovered he was built for the dohyo — heavy, powerful, with a thrusting style that sent bigger men backwards before they had time to think. He became only the second Bulgarian to reach the professional ranks, rose to sekiwake, and finished as tournament runner-up twice without ever claiming the championship he deserved. He obtained Japanese citizenship in March 2022, retired after September 2024, and stayed in sumo as a coach — a man who arrived by accident and stayed for a lifetime.",
};

async function main() {
  console.log("Seeding rikishi biographies…");
  let updated = 0;

  for (const [shikonaEn, biography] of Object.entries(bios)) {
    const result = await db.rikishi.updateMany({
      where: { shikonaEn: { contains: shikonaEn, mode: "insensitive" } },
      data: { biography },
    });
    if (result.count > 0) {
      console.log(`  ✓ ${shikonaEn} (${result.count} row)`);
      updated += result.count;
    } else {
      console.log(`  – ${shikonaEn} not found in DB`);
    }
  }

  console.log(`\nDone. Updated ${updated} rikishi.`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
