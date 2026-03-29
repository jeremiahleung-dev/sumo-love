export interface KimariteData {
  nameJp: string;
  nameEn: string;
  category: string;
  description: string;
  animationId: string;
}

export const KIMARITE_DATA: KimariteData[] = [
  // ── Push / Force-out ──────────────────────────────────────────────────────
  {
    nameJp: "寄り切り",
    nameEn: "Yorikiri",
    category: "Push",
    animationId: "push",
    description:
      "Frontal force-out. The winner drives the opponent backwards out of the ring while maintaining chest-to-chest contact and gripping the opponent's belt (mawashi).",
  },
  {
    nameJp: "押し出し",
    nameEn: "Oshidashi",
    category: "Push",
    animationId: "push",
    description:
      "Frontal push-out. The winner pushes the opponent out of the ring using the hands on the opponent's chest or shoulders — no belt grip is used.",
  },
  {
    nameJp: "突き出し",
    nameEn: "Tsukidashi",
    category: "Push",
    animationId: "push",
    description:
      "Frontal thrust-out. The winner repeatedly thrusts or jabs the opponent with an open palm, forcing them out without grabbing the mawashi.",
  },
  {
    nameJp: "押し倒し",
    nameEn: "Oshitaoshi",
    category: "Push",
    animationId: "push",
    description:
      "Frontal push-down. The winner pushes the opponent down to the clay inside the ring rather than forcing them over the tawara.",
  },
  {
    nameJp: "突き倒し",
    nameEn: "Tsukitaoshi",
    category: "Push",
    animationId: "push",
    description:
      "Frontal thrust-down. Similar to Tsukidashi but the opponent falls to the clay inside the ring rather than being pushed out.",
  },
  {
    nameJp: "寄り倒し",
    nameEn: "Yoritaoshi",
    category: "Push",
    animationId: "push",
    description:
      "Frontal force-down. The winner presses the opponent to the clay while maintaining a belt grip; the opponent falls without crossing the tawara.",
  },
  {
    nameJp: "腹押し出し",
    nameEn: "Haraoshidashi",
    category: "Push",
    animationId: "push",
    description:
      "Stomach push-out. The winner uses the belly or stomach area to push the opponent out of the ring.",
  },

  // ── Throw (belt) ──────────────────────────────────────────────────────────
  {
    nameJp: "上手投げ",
    nameEn: "Uwatenage",
    category: "Throw",
    animationId: "throw",
    description:
      "Overarm throw. The winner grips the far side of the opponent's belt with an overarm grip and throws them to the clay.",
  },
  {
    nameJp: "下手投げ",
    nameEn: "Shitatenage",
    category: "Throw",
    animationId: "throw",
    description:
      "Underarm throw. The winner grips the near side of the opponent's belt with an underarm grip and throws them to the clay.",
  },
  {
    nameJp: "上手出し投げ",
    nameEn: "Uwatedashinage",
    category: "Throw",
    animationId: "throw",
    description:
      "Overarm pulling throw. While gripping the opponent's belt overarm, the winner pulls and throws them forward and down.",
  },
  {
    nameJp: "下手出し投げ",
    nameEn: "Shitatedashinage",
    category: "Throw",
    animationId: "throw",
    description:
      "Underarm pulling throw. While gripping the opponent's belt underarm, the winner pulls and throws them forward and down.",
  },
  {
    nameJp: "小手投げ",
    nameEn: "Kotenage",
    category: "Throw",
    animationId: "throw",
    description:
      "Inner arm throw. The winner wraps their arm around the opponent's outer arm and throws them, leveraging the arm rather than the belt.",
  },
  {
    nameJp: "掬い投げ",
    nameEn: "Sukuinage",
    category: "Throw",
    animationId: "throw",
    description:
      "Beltless arm throw. The winner scoops under the opponent's arm without a belt grip and flips them to the side.",
  },
  {
    nameJp: "つかみ投げ",
    nameEn: "Tsukaminage",
    category: "Throw",
    animationId: "throw",
    description:
      "Grappling throw. The winner grabs the opponent's mawashi with both hands and hurls them to the clay.",
  },
  {
    nameJp: "内無双",
    nameEn: "Uchimuso",
    category: "Throw",
    animationId: "throw",
    description:
      "Inner thigh throw. The winner taps or hooks the inside of the opponent's thigh with their hand to knock them down.",
  },
  {
    nameJp: "外無双",
    nameEn: "Sotomuso",
    category: "Throw",
    animationId: "throw",
    description:
      "Outer thigh throw. The winner slaps or sweeps the outside of the opponent's thigh to unbalance and topple them.",
  },
  {
    nameJp: "波離間投げ",
    nameEn: "Hariminage",
    category: "Throw",
    animationId: "throw",
    description:
      "Slapping throw. The winner smacks the side of the opponent's face or neck while simultaneously throwing them to the side.",
  },
  {
    nameJp: "首投げ",
    nameEn: "Kubinage",
    category: "Throw",
    animationId: "throw",
    description:
      "Head-lock throw. The winner wraps an arm around the opponent's neck and throws them using the head and neck as a lever.",
  },
  {
    nameJp: "撓み反り",
    nameEn: "Tawara-gaeri",
    category: "Throw",
    animationId: "throw",
    description:
      "Straw bale reversal. While being pushed to the tawara, the winner bends backward, grabs the opponent, and throws them over their own body.",
  },
  {
    nameJp: "腰投げ",
    nameEn: "Koshinage",
    category: "Throw",
    animationId: "throw",
    description:
      "Hip throw. The winner turns and uses their hip as a pivot point to flip the opponent over their back to the clay.",
  },

  // ── Trip / Leg ────────────────────────────────────────────────────────────
  {
    nameJp: "足取り",
    nameEn: "Ashitori",
    category: "Trip",
    animationId: "trip",
    description:
      "Leg pick. The winner grabs the opponent's leg and lifts it, toppling them to the clay or forcing them across the tawara.",
  },
  {
    nameJp: "掛け投げ",
    nameEn: "Kakenage",
    category: "Trip",
    animationId: "trip",
    description:
      "Hooking inner thigh throw. The winner hooks a leg behind the opponent's knee and throws them to the inside.",
  },
  {
    nameJp: "外掛け",
    nameEn: "Sotogake",
    category: "Trip",
    animationId: "trip",
    description:
      "Outer leg trip. The winner hooks their leg around the outside of the opponent's leg to trip them to the clay.",
  },
  {
    nameJp: "内掛け",
    nameEn: "Uchigake",
    category: "Trip",
    animationId: "trip",
    description:
      "Inner leg trip. The winner hooks their leg around the inside of the opponent's leg to knock them off balance.",
  },
  {
    nameJp: "蹴り返し",
    nameEn: "Kekaeshi",
    category: "Trip",
    animationId: "trip",
    description:
      "Heel kick reversal. The winner uses a foot to kick the opponent's heel out from under them, sending them backward.",
  },
  {
    nameJp: "蹴手繰り",
    nameEn: "Ketteguri",
    category: "Trip",
    animationId: "trip",
    description:
      "Grabbing heel trip. The winner simultaneously sweeps the opponent's leg with their foot while pulling on the opponent's arm.",
  },
  {
    nameJp: "二丁投げ",
    nameEn: "Nichonage",
    category: "Trip",
    animationId: "trip",
    description:
      "Two-handed throw with leg trip. The winner grabs both of the opponent's arms while tripping them with a leg.",
  },
  {
    nameJp: "裾取り",
    nameEn: "Susotori",
    category: "Trip",
    animationId: "trip",
    description:
      "Ankle pick. The winner grabs the opponent's ankle and lifts it to topple them to the clay.",
  },
  {
    nameJp: "裾払い",
    nameEn: "Susoharai",
    category: "Trip",
    animationId: "trip",
    description:
      "Ankle sweep. The winner sweeps the opponent's ankle sideways to knock them off balance.",
  },

  // ── Lift ──────────────────────────────────────────────────────────────────
  {
    nameJp: "抱き締め",
    nameEn: "Dakishime",
    category: "Lift",
    animationId: "lift",
    description:
      "Bear hug force-out. The winner wraps both arms around the opponent's body (not the belt) and carries or forces them out of the ring.",
  },
  {
    nameJp: "送り出し",
    nameEn: "Okuridashi",
    category: "Lift",
    animationId: "lift",
    description:
      "Rear push-out. Getting behind the opponent, the winner pushes them out from behind.",
  },
  {
    nameJp: "送り投げ",
    nameEn: "Okurinage",
    category: "Lift",
    animationId: "lift",
    description:
      "Rear throw. Getting behind the opponent, the winner grabs their mawashi or body and throws them to the clay from the back.",
  },
  {
    nameJp: "送り倒し",
    nameEn: "Okuritaoshi",
    category: "Lift",
    animationId: "lift",
    description:
      "Rear push-down. Getting behind the opponent, the winner pushes them down to the clay.",
  },
  {
    nameJp: "送り吊り出し",
    nameEn: "Okuritsuri-dashi",
    category: "Lift",
    animationId: "lift",
    description:
      "Rear lift-out. Getting behind the opponent, the winner lifts them by the belt and carries them over the tawara.",
  },
  {
    nameJp: "吊り出し",
    nameEn: "Tsuridashi",
    category: "Lift",
    animationId: "lift",
    description:
      "Lift-out. The winner grips both sides of the opponent's belt and lifts them completely off the clay, then carries them out of the ring.",
  },
  {
    nameJp: "吊り落とし",
    nameEn: "Tsuriotoshi",
    category: "Lift",
    animationId: "lift",
    description:
      "Lift and drop. The winner lifts the opponent by the belt and drops them to the clay inside the ring.",
  },
  {
    nameJp: "引き落とし",
    nameEn: "Hikiotoshi",
    category: "Pull",
    animationId: "pull",
    description:
      "Hand pull-down. The winner grabs or slaps one or both of the opponent's arms while pulling them down and to the side, causing them to fall.",
  },
  {
    nameJp: "叩き込み",
    nameEn: "Hatakikomi",
    category: "Pull",
    animationId: "pull",
    description:
      "Slap-down. As the opponent charges forward, the winner sidesteps and slaps them down to the clay with a hand to the back of the head or shoulders.",
  },
  {
    nameJp: "引き落とし",
    nameEn: "Hikkake",
    category: "Pull",
    animationId: "pull",
    description:
      "Arm hooking force-out. The winner hooks an arm under the opponent's armpit and uses that leverage to force them out or down.",
  },

  // ── Pull / Pull-down ──────────────────────────────────────────────────────
  {
    nameJp: "突き落とし",
    nameEn: "Tsukiotoshi",
    category: "Pull",
    animationId: "pull",
    description:
      "Thrust-down. The winner uses thrusting motions to the side of the opponent's neck or chest to knock them off balance and down.",
  },
  {
    nameJp: "倒し込み",
    nameEn: "Toshikomi",
    category: "Pull",
    animationId: "pull",
    description:
      "Frontal crush-down. The winner uses body pressure to force the opponent to the clay without throwing or tripping.",
  },
  {
    nameJp: "首捻り",
    nameEn: "Kubhineri",
    category: "Twist",
    animationId: "twist",
    description:
      "Neck twist. The winner grabs the opponent's head or neck and twists them to the clay.",
  },

  // ── Twist ─────────────────────────────────────────────────────────────────
  {
    nameJp: "上手捻り",
    nameEn: "Uwatenehiri",
    category: "Twist",
    animationId: "twist",
    description:
      "Overarm twist-down. With an overarm belt grip, the winner twists the opponent's body to deposit them on the clay.",
  },
  {
    nameJp: "下手捻り",
    nameEn: "Shitatenehiri",
    category: "Twist",
    animationId: "twist",
    description:
      "Underarm twist-down. With an underarm belt grip, the winner twists the opponent's body to the clay.",
  },
  {
    nameJp: "小手捻り",
    nameEn: "Kotenehiri",
    category: "Twist",
    animationId: "twist",
    description:
      "Inner arm twist. The winner locks the opponent's arm and twists it, rotating their body to the clay.",
  },
  {
    nameJp: "腕捻り",
    nameEn: "Udanehiri",
    category: "Twist",
    animationId: "twist",
    description:
      "Arm twist. The winner grabs and twists the opponent's arm, toppling them to the clay.",
  },
  {
    nameJp: "腕返し",
    nameEn: "Udakaeshi",
    category: "Twist",
    animationId: "twist",
    description:
      "Arm reversal. The winner catches the opponent's extended arm and turns it, using the arm as a lever to put them on the clay.",
  },

  // ── Special / Rare ────────────────────────────────────────────────────────
  {
    nameJp: "勇み足",
    nameEn: "Isamiashi",
    category: "Special",
    animationId: "special",
    description:
      "Inadvertent step-out. The winning rikishi steps out or touches down first due to their own forward momentum — a loss caused by over-eagerness. The opponent is declared the winner.",
  },
  {
    nameJp: "掛け反り",
    nameEn: "Kake-nage",
    category: "Special",
    animationId: "special",
    description:
      "Hooking backward throw. The winner hooks a leg behind the opponent and bends backward to throw them over.",
  },
  {
    nameJp: "掛け捻り",
    nameEn: "Kakenehiri",
    category: "Special",
    animationId: "special",
    description:
      "Hooking twist. The winner hooks a leg behind the opponent and twists their body to flip them to the clay.",
  },
  {
    nameJp: "反り投げ",
    nameEn: "Sorinagi",
    category: "Special",
    animationId: "special",
    description:
      "Backward body drop. The winner arches their back and falls backward to throw the opponent, who is above or in front, to the clay.",
  },
  {
    nameJp: "足癖",
    nameEn: "Ashikuse",
    category: "Trip",
    animationId: "trip",
    description:
      "Leg entanglement. The winner uses their foot to entangle the opponent's legs, causing them to fall.",
  },
  {
    nameJp: "ずぶねり",
    nameEn: "Zubuneri",
    category: "Twist",
    animationId: "twist",
    description:
      "Body twist. A full-body twisting technique where the winner rotates the opponent completely to deposit them on the clay.",
  },
  {
    nameJp: "徳俵",
    nameEn: "Toku-dawara",
    category: "Special",
    animationId: "special",
    description:
      "Toku-dawara (corner bale) reversal. The winner uses the specially recessed corner bales of the dohyo to regain balance and reverse the bout.",
  },
  {
    nameJp: "居反り",
    nameEn: "Izori",
    category: "Special",
    animationId: "special",
    description:
      "Backward counter throw. Squatting low, the winner grabs the opponent's leg and uses a backward lean to throw them over their body.",
  },
  {
    nameJp: "裏投げ",
    nameEn: "Uranage",
    category: "Throw",
    animationId: "throw",
    description:
      "Rear pivot throw. When grabbed from behind, the winner turns sharply and throws the opponent over their body to the clay.",
  },
  {
    nameJp: "逆とったり",
    nameEn: "Gyaku-tottari",
    category: "Throw",
    animationId: "throw",
    description:
      "Reverse arm bar throw. Like Tottari but applied to the opponent's arm from the outside, twisting it to throw them forward.",
  },
  {
    nameJp: "とったり",
    nameEn: "Tottari",
    category: "Throw",
    animationId: "throw",
    description:
      "Arm bar throw. The winner grabs both of the opponent's arms and uses them as a lever to throw them sideways to the clay.",
  },
  {
    nameJp: "切り返し",
    nameEn: "Kirikaeshi",
    category: "Trip",
    animationId: "trip",
    description:
      "Twisting backward knee trip. While being driven back, the winner pivots and hooks the back of the opponent's knee to reverse the momentum and trip them.",
  },
  {
    nameJp: "河津掛け",
    nameEn: "Kawazugake",
    category: "Special",
    animationId: "special",
    description:
      "Kawazu hook. Named after a legendary wrestler, this rare technique involves hooking a leg around the opponent's, falling backward, and rolling them to the clay simultaneously.",
  },
  {
    nameJp: "閂",
    nameEn: "Kannuki",
    category: "Special",
    animationId: "special",
    description:
      "Double arm bar. The winner traps both of the opponent's arms under their own arms like a bolt bar, paralyzing them and forcing them down.",
  },
  {
    nameJp: "網打ち",
    nameEn: "Amiauchi",
    category: "Throw",
    animationId: "throw",
    description:
      "Fisherman's throw. The winner spreads their arms wide like casting a net and brings them down, throwing the opponent.",
  },
  {
    nameJp: "蛟竜",
    nameEn: "Mizunage",
    category: "Special",
    animationId: "special",
    description:
      "Water throw. An extremely rare technique where the winner uses hip torque to fling the opponent up and to the side.",
  },
  {
    nameJp: "鯖折り",
    nameEn: "Sabaori",
    category: "Special",
    animationId: "special",
    description:
      "Mackerel bend. The winner grabs the opponent's mawashi with both hands and bends them over forward, forcing them to the clay face-first.",
  },
  {
    nameJp: "送り足取り",
    nameEn: "Okuri-ashitori",
    category: "Trip",
    animationId: "trip",
    description:
      "Rear leg pick. Getting behind the opponent, the winner grabs their leg to topple them.",
  },
  {
    nameJp: "蹴返し",
    nameEn: "Kekaeshi",
    category: "Trip",
    animationId: "trip",
    description:
      "Heel sweep return. The winner sweeps the back of the opponent's heel, collapsing their stance.",
  },
  {
    nameJp: "外たぐり",
    nameEn: "Sotataguri",
    category: "Pull",
    animationId: "pull",
    description:
      "Outer arm drag. The winner grabs the outer arm of the opponent and drags them around and down.",
  },
  {
    nameJp: "内たぐり",
    nameEn: "Uchigakari",
    category: "Pull",
    animationId: "pull",
    description:
      "Inner arm drag. The winner grabs the inner arm of the opponent and pulls them sharply downward.",
  },
  {
    nameJp: "吊り",
    nameEn: "Tsuri",
    category: "Lift",
    animationId: "lift",
    description:
      "Lift. The winner grips the belt and lifts the opponent completely off the ground mid-bout to throw off their balance.",
  },
  {
    nameJp: "腰砕け",
    nameEn: "Koshikudake",
    category: "Special",
    animationId: "special",
    description:
      "Collapsing hips. The winner's opponent collapses to the clay due to their own collapsing legs or hips — unusual as it can result from fatigue or injury.",
  },
  {
    nameJp: "引き落とし(前)",
    nameEn: "Maekemimawashi",
    category: "Pull",
    animationId: "pull",
    description:
      "Front belt pull-down. The winner grabs the front of the opponent's mawashi and pulls them sharply forward and down.",
  },
  {
    nameJp: "首捻り",
    nameEn: "Necknage",
    category: "Twist",
    animationId: "twist",
    description:
      "Neck crank. The winner grabs the back of the opponent's neck and twists them down to the clay.",
  },
  {
    nameJp: "決まり手なし",
    nameEn: "No Kimarite",
    category: "Special",
    animationId: "special",
    description:
      "No winning technique declared. Used when the gyoji (referee) and judges cannot definitively assign a kimarite to the outcome of the bout.",
  },
  {
    nameJp: "すくい投げ",
    nameEn: "Sukuinage (variant)",
    category: "Throw",
    animationId: "throw",
    description:
      "Scoop throw variant. The winner scoops under the opponent's body and lifts-throws them to the clay.",
  },
  {
    nameJp: "前みつ",
    nameEn: "Maemitsu",
    category: "Push",
    animationId: "push",
    description:
      "Front-of-belt grip force-out. The winner grips the front knot of the opponent's mawashi and uses it to control and force them out.",
  },
  {
    nameJp: "浴びせ倒し",
    nameEn: "Abisedaoshi",
    category: "Push",
    animationId: "push",
    description:
      "Frontal body crush. The winner falls forward and uses their body weight to crush the opponent to the clay.",
  },
  {
    nameJp: "二枚蹴り",
    nameEn: "Nimaigerim",
    category: "Trip",
    animationId: "trip",
    description:
      "Double-leg kick. The winner kicks both of the opponent's legs simultaneously to topple them.",
  },
  {
    nameJp: "踏み出し",
    nameEn: "Fumidashi",
    category: "Push",
    animationId: "push",
    description:
      "Stepping-out. The opponent steps out under their own power due to the winner's relentless forward pressure.",
  },
  {
    nameJp: "打っちゃり",
    nameEn: "Utchari",
    category: "Special",
    animationId: "special",
    description:
      "Last-gasp swing-down. While being pushed to the tawara, the winner grabs the opponent's belt and swings them around in a last-ditch effort — both may go over, but the opponent touches down first.",
  },
];
