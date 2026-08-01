export const SITE = {
  name: "Dulce Bun House",
  address: "48 Oliver Plunkett St, Centre, Cork, T12 C6KF",
  phone: "(021) 241 3256",
  phoneHref: "tel:+353212413256",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Dulce+Bun+House+48+Oliver+Plunkett+St+Cork",
};

export const HOURS: { day: string; time: string }[] = [
  { day: "Monday", time: "8:30 – 18:00" },
  { day: "Tuesday", time: "8:30 – 18:00" },
  { day: "Wednesday", time: "8:30 – 18:00" },
  { day: "Thursday", time: "8:30 – 18:00" },
  { day: "Friday", time: "8:30 – 18:00" },
  { day: "Saturday", time: "9:30 – 18:00" },
  { day: "Sunday", time: "10:30 – 18:00" },
];

// NOTE: prices are placeholders pending the real menu — see README.
export const MENU: {
  category: string;
  blurb: string;
  items: { name: string; desc: string; price: string; tag?: string }[];
}[] = [
  {
    category: "The Buns",
    blurb: "Baked in-house every morning. When they're gone, they're gone.",
    items: [
      {
        name: "Classic Cinnamon",
        desc: "Soft brioche swirl, brown butter glaze",
        price: "€4.20",
        tag: "the one",
      },
      {
        name: "Biscoff Cream",
        desc: "Lotus crumb, whipped biscoff filling",
        price: "€4.50",
      },
      {
        name: "Pistachio & White Choc",
        desc: "Roasted pistachio cream, white chocolate drizzle",
        price: "€4.80",
        tag: "sells out",
      },
      {
        name: "Nutella Cloud",
        desc: "Hazelnut cream centre, cocoa dusting",
        price: "€4.50",
      },
      {
        name: "Raspberry Custard",
        desc: "Vanilla bean custard, fresh raspberry",
        price: "€4.60",
      },
      {
        name: "Lemon Meringue",
        desc: "Sharp lemon curd, torched meringue",
        price: "€4.60",
      },
    ],
  },
  {
    category: "The Coffee",
    blurb: "Locally roasted beans, dialled in daily. Oat milk? Always.",
    items: [
      { name: "Espresso", desc: "Double, always", price: "€2.80" },
      { name: "Flat White", desc: "The Cork standard", price: "€3.80" },
      { name: "Latte", desc: "Hot or iced", price: "€3.90" },
      { name: "Cappuccino", desc: "Proper foam", price: "€3.80" },
      { name: "Iced Latte", desc: "Cold brew base", price: "€4.20" },
      {
        name: "Matcha Latte",
        desc: "Ceremonial grade, hot or iced",
        price: "€4.50",
        tag: "trending",
      },
      { name: "Chai Latte", desc: "House spice blend", price: "€4.30" },
      { name: "Hot Chocolate", desc: "70% dark, real cream", price: "€4.00" },
    ],
  },
];

export const GALLERY: { src: string; alt: string }[] = [
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEFcAbGPiKgcLMpZEHAttHTPDjoKeVXRINqxDpsfAqSUc_8nkL52xYf3g79GlZs27k6VcNLNTu25GG4de3qVtuXWWj1SpgYpwH-khyWQz0sQDH-4PMNCr1J_sVL1RwD0wqKEYDJ=s1360-w1360-h1020-rw",
    alt: "Fresh buns in the Dulce Bun House display",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG3PZ12kacUrEff6dmf7W7m7fva3VEIDiLnX1PeOhdsOVKst9qRZ79pJmlIPOAXM9j0gJbam63Ydw0kkuPaXnTFAfnHS4Pyp2Q6rF93aeZg_5EWtz6noLnS5uLfe0evktjb-jaQnw=s1360-w1360-h1020-rw",
    alt: "Inside the café on Oliver Plunkett Street",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFxPi_lKPqltKnwEhxYKDsxwoJHy47W5pxIOk_SOcu06KukxHfgOCZf8-TFl4rQdfdB_iOTNnU_78VRQ9RAHQL9vvoN9FGkvjX06pw2bSiD2H6bVNrfdH_xll34cHVQFbz0waC-bw=s1360-w1360-h1020-rw",
    alt: "Buns and coffee at Dulce Bun House",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEymJXeSFAFTg8sSvMT02GS_r0nHnxJ_h8uae0IuDq-o1spDOwuIGdTuN3jGCjWh11wz-mNUaF4WlyaYrusnDePTvbgf1uJjJbWvvXgiYp5rli5zqcB2Kr4QYNEJ-wqubMI6P0=s1360-w1360-h1020-rw",
    alt: "Glazed cinnamon buns close up",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGSn8LvmBa_WmBWU_p4M1YmdNkeadozV85_EznsKEPpsqwurUBmpzz3FG651YawK5oNFtXb8G3ChCv2QlFoFOkfx4TJsKreVK9WkGV9oFd2SONDdUlhOD7KHA8_hOk-v2N_VDxukCtb2Ks=s1360-w1360-h1020-rw",
    alt: "Coffee being made at the counter",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG6lndrYFf8nL38i6gAfvf2nT1oS86lPjZakQtcmjG3pw8MTjjwlTBckUAz0b1RPxHrMoY_6zvpQeW28KS_EPspB209hp7D9l8RgiwewMRTK9pPg9OZ5v_7ZcH7I_Dw2-eLbTa8OiKdjKWw=s1360-w1360-h1020-rw",
    alt: "Seasonal special bun",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGmm35roORTnklyY45eeSHrSJ2b26o91eXzB_WbbfNqlZTcR-ZISCaV5qGj1dbBDf8XdQ5_v-yy6mxnnHOnD8o3JHWNx18vrrBCaXh7oSKa4yfqe8SjILOuqk5sLfHj6-HaHmE=s1360-w1360-h1020-rw",
    alt: "Café interior details",
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEAGzjXU0f3WIKwQU0bKK2OzqlDZuvjlAx195mNdK_wLAbvR3zuyqTHUF5k8-sSO-t5V5aXs183DYSftPBKWoggWhj1xPVuboh4y4sIHA0-QGCRFrim8gtju3VqXKs9JWUamPNCdn3bero=s1360-w1360-h1020-rw",
    alt: "Takeaway coffee and bun",
  },
];
