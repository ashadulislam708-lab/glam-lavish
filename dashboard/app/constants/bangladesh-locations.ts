import { ShippingZoneEnum } from "~/enums";

export interface BangladeshDistrict {
  name: string;
  upazilas: string[];
}

/**
 * All 64 districts of Bangladesh with their upazilas.
 * Sorted alphabetically by district name.
 * Source: Bangladesh Bureau of Statistics.
 *
 * To add a custom location, simply add a new entry to this array
 * or append to an existing district's upazilas list.
 */
export const BANGLADESH_DISTRICTS: BangladeshDistrict[] = [
  {
    name: "Barguna",
    upazilas: ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali"],
  },
  {
    name: "Barishal",
    upazilas: [
      "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Barishal Sadar",
      "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur",
    ],
  },
  {
    name: "Bhola",
    upazilas: [
      "Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan",
      "Manpura", "Tazumuddin",
    ],
  },
  {
    name: "Jhalokati",
    upazilas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"],
  },
  {
    name: "Patuakhali",
    upazilas: [
      "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara",
      "Mirzaganj", "Patuakhali Sadar", "Rangabali",
    ],
  },
  {
    name: "Pirojpur",
    upazilas: [
      "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad",
      "Pirojpur Sadar", "Zianagar",
    ],
  },
  {
    name: "Bandarban",
    upazilas: [
      "Ali Kadam", "Bandarban Sadar", "Lama", "Naikhongchhari",
      "Rowangchhari", "Ruma", "Thanchi",
    ],
  },
  {
    name: "Brahmanbaria",
    upazilas: [
      "Akhaura", "Bancharampur", "Brahmanbaria Sadar", "Kasba",
      "Nabinagar", "Nasirnagar", "Sarail", "Ashuganj", "Bijoynagar",
    ],
  },
  {
    name: "Chandpur",
    upazilas: [
      "Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj",
      "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti",
    ],
  },
  {
    name: "Chattogram",
    upazilas: [
      "Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Chattogram Sadar",
      "Fatikchhari", "Hathazari", "Karnaphuli", "Lohagara", "Mirsharai",
      "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda",
    ],
  },
  {
    name: "Comilla",
    upazilas: [
      "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram",
      "Comilla Sadar", "Comilla Sadar Dakshin", "Daudkandi", "Debidwar",
      "Homna", "Laksam", "Lalmai", "Meghna", "Monohorgonj", "Muradnagar",
      "Nangalkot", "Titas",
    ],
  },
  {
    name: "Cox's Bazar",
    upazilas: [
      "Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali",
      "Pekua", "Ramu", "Teknaf", "Ukhia",
    ],
  },
  {
    name: "Feni",
    upazilas: ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Fulgazi", "Parshuram", "Sonagazi"],
  },
  {
    name: "Khagrachhari",
    upazilas: [
      "Dighinala", "Guimara", "Khagrachhari Sadar", "Lakshmichhari",
      "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh",
    ],
  },
  {
    name: "Lakshmipur",
    upazilas: ["Kamalnagar", "Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati"],
  },
  {
    name: "Noakhali",
    upazilas: [
      "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat",
      "Noakhali Sadar", "Senbagh", "Sonaimuri", "Subarnachar",
    ],
  },
  {
    name: "Rangamati",
    upazilas: [
      "Baghaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai",
      "Kawkhali", "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar",
    ],
  },
  {
    name: "Dhaka",
    upazilas: [
      // Inside Dhaka — DSCC (South)
      "Adabor", "Bangshal", "Chak Bazar", "Demra", "Dhanmondi",
      "Gendaria", "Hazaribagh", "Jatrabari", "Kadamtali", "Kalabagan",
      "Kamrangirchar", "Khilgaon", "Kotwali", "Lalbagh", "Motijheel",
      "Mugda", "New Market", "Paltan", "Ramna", "Sabujbagh",
      "Shahbag", "Shahjahanpur", "Shyampur", "Sutrapur", "Wari",
      // Inside Dhaka — DNCC (North)
      "Badda", "Banani", "Bhashantek", "Bimanbandar", "Cantonment",
      "Dakshinkhan", "Darussalam", "Gulshan", "Hatirjheel", "Kafrul",
      "Khilkhet", "Mirpur", "Mohammadpur", "Pallabi", "Rampura",
      "Rupnagar", "Shah Ali", "Sher-e-Bangla Nagar", "Tejgaon",
      "Tejgaon Industrial Area", "Turag", "Uttara East", "Uttara West",
      "Uttarkhan", "Vatara",
      // Dhaka Sub-Area upazilas
      "Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar",
    ],
  },
  {
    name: "Faridpur",
    upazilas: [
      "Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Faridpur Sadar",
      "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha",
    ],
  },
  {
    name: "Gazipur",
    upazilas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  },
  {
    name: "Gopalganj",
    upazilas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
  },
  {
    name: "Kishoreganj",
    upazilas: [
      "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna",
      "Karimganj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar",
      "Mithamain", "Nikli", "Pakundia", "Tarail",
    ],
  },
  {
    name: "Madaripur",
    upazilas: ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar"],
  },
  {
    name: "Manikganj",
    upazilas: [
      "Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar",
      "Saturia", "Shivalaya", "Singair",
    ],
  },
  {
    name: "Munshiganj",
    upazilas: [
      "Gazaria", "Lohajang", "Munshiganj Sadar", "Sirajdikhan",
      "Sreenagar", "Tongibari",
    ],
  },
  {
    name: "Narayanganj",
    upazilas: [
      "Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon",
    ],
  },
  {
    name: "Narsingdi",
    upazilas: ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"],
  },
  {
    name: "Rajbari",
    upazilas: ["Baliakandi", "Goalandaghat", "Kalukhali", "Pangsha", "Rajbari Sadar"],
  },
  {
    name: "Shariatpur",
    upazilas: [
      "Bhedarganj", "Damudya", "Gosairhat", "Naria",
      "Shariatpur Sadar", "Zanjira",
    ],
  },
  {
    name: "Tangail",
    upazilas: [
      "Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail",
      "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur",
      "Sakhipur", "Tangail Sadar",
    ],
  },
  {
    name: "Bagerhat",
    upazilas: [
      "Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua",
      "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola",
    ],
  },
  {
    name: "Chuadanga",
    upazilas: ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"],
  },
  {
    name: "Jessore",
    upazilas: [
      "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha",
      "Jessore Sadar", "Keshabpur", "Manirampur", "Sharsha",
    ],
  },
  {
    name: "Jhenaidah",
    upazilas: ["Harinakunda", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
  },
  {
    name: "Khulna",
    upazilas: [
      "Batiaghata", "Dacope", "Daulatpur", "Dighalia", "Dumuria",
      "Khalishpur", "Khan Jahan Ali", "Khulna Sadar", "Koyra",
      "Paikgachha", "Phultala", "Rupsha", "Sonadanga", "Terokhada",
    ],
  },
  {
    name: "Kushtia",
    upazilas: [
      "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali",
      "Kushtia Sadar", "Mirpur",
    ],
  },
  {
    name: "Magura",
    upazilas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
  },
  {
    name: "Meherpur",
    upazilas: ["Gangni", "Meherpur Sadar", "Mujibnagar"],
  },
  {
    name: "Narail",
    upazilas: ["Kalia", "Lohagara", "Narail Sadar"],
  },
  {
    name: "Satkhira",
    upazilas: ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"],
  },
  {
    name: "Jamalpur",
    upazilas: [
      "Bakshiganj", "Dewanganj", "Islampur", "Jamalpur Sadar",
      "Madarganj", "Melandaha", "Sarishabari",
    ],
  },
  {
    name: "Mymensingh",
    upazilas: [
      "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur",
      "Haluaghat", "Ishwarganj", "Muktagachha", "Mymensingh Sadar",
      "Nandail", "Phulpur", "Tarakanda", "Trishal",
    ],
  },
  {
    name: "Netrokona",
    upazilas: [
      "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua",
      "Khaliajuri", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala",
    ],
  },
  {
    name: "Sherpur",
    upazilas: ["Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi"],
  },
  {
    name: "Bogura",
    upazilas: [
      "Adamdighi", "Bogura Sadar", "Dhunat", "Dhupchanchia", "Gabtali",
      "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur",
      "Shibganj", "Sonatola",
    ],
  },
  {
    name: "Chapainawabganj",
    upazilas: ["Bholahat", "Chapainawabganj Sadar", "Gomastapur", "Nachole", "Shibganj"],
  },
  {
    name: "Joypurhat",
    upazilas: ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"],
  },
  {
    name: "Naogaon",
    upazilas: [
      "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur",
      "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar",
      "Sapahar",
    ],
  },
  {
    name: "Natore",
    upazilas: ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Natore Sadar", "Singra"],
  },
  {
    name: "Nawabganj",
    upazilas: ["Bholahat", "Gomastapur", "Nachole", "Nawabganj Sadar", "Shibganj"],
  },
  {
    name: "Nilphamari",
    upazilas: [
      "Dimla", "Domar", "Jaldhaka", "Kishoreganj",
      "Nilphamari Sadar", "Saidpur",
    ],
  },
  {
    name: "Pabna",
    upazilas: [
      "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur",
      "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar",
    ],
  },
  {
    name: "Rajshahi",
    upazilas: [
      "Bagha", "Bagmara", "Boalia", "Charghat", "Durgapur",
      "Godagari", "Mohanpur", "Paba", "Puthia", "Rajshahi Sadar",
      "Shah Makhdum", "Tanore",
    ],
  },
  {
    name: "Sirajganj",
    upazilas: [
      "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur",
      "Raiganj", "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullahpara",
    ],
  },
  {
    name: "Dinajpur",
    upazilas: [
      "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar",
      "Dinajpur Sadar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole",
      "Khansama", "Nawabganj", "Parbatipur",
    ],
  },
  {
    name: "Gaibandha",
    upazilas: [
      "Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari",
      "Sadullapur", "Saghata", "Sundarganj",
    ],
  },
  {
    name: "Kurigram",
    upazilas: [
      "Bhurungamari", "Char Rajibpur", "Chilmari", "Kurigram Sadar",
      "Nageshwari", "Phulbari", "Rajarhat", "Raumari", "Ulipur",
    ],
  },
  {
    name: "Lalmonirhat",
    upazilas: ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"],
  },
  {
    name: "Panchagarh",
    upazilas: ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"],
  },
  {
    name: "Rangpur",
    upazilas: [
      "Badarganj", "Gangachara", "Kaunia", "Mithapukur",
      "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj",
    ],
  },
  {
    name: "Thakurgaon",
    upazilas: ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"],
  },
  {
    name: "Habiganj",
    upazilas: [
      "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat",
      "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj",
    ],
  },
  {
    name: "Moulvibazar",
    upazilas: [
      "Barlekha", "Juri", "Kamalganj", "Kulaura",
      "Moulvibazar Sadar", "Rajnagar", "Sreemangal",
    ],
  },
  {
    name: "Sunamganj",
    upazilas: [
      "Bishwamvarpur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar",
      "Jagannathpur", "Jamalganj", "Sulla", "Sunamganj Sadar", "Tahirpur",
    ],
  },
  {
    name: "Sylhet",
    upazilas: [
      "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Dakshin Surma",
      "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat",
      "Osmani Nagar", "Sylhet Sadar", "Zakiganj",
    ],
  },
];

/**
 * District-to-shipping-zone mapping.
 * Districts not listed here default to OUTSIDE_DHAKA.
 */
export const DISTRICT_ZONE_MAP: Record<string, ShippingZoneEnum> = {
  Dhaka: ShippingZoneEnum.INSIDE_DHAKA,
  Gazipur: ShippingZoneEnum.DHAKA_SUB_AREA,
  Narayanganj: ShippingZoneEnum.DHAKA_SUB_AREA,
  Manikganj: ShippingZoneEnum.DHAKA_SUB_AREA,
  Munshiganj: ShippingZoneEnum.DHAKA_SUB_AREA,
  Narsingdi: ShippingZoneEnum.DHAKA_SUB_AREA,
};

/** Get the shipping zone for a given district name. */
export function getZoneForDistrict(district: string): ShippingZoneEnum {
  return DISTRICT_ZONE_MAP[district] ?? ShippingZoneEnum.OUTSIDE_DHAKA;
}

/** Get upazilas for a given district name. Returns empty array if not found. */
export function getUpazilasForDistrict(district: string): string[] {
  return BANGLADESH_DISTRICTS.find((d) => d.name === district)?.upazilas ?? [];
}

/** Sorted list of all district names for dropdown use. */
export const DISTRICT_NAMES: string[] = BANGLADESH_DISTRICTS.map((d) => d.name).sort();
