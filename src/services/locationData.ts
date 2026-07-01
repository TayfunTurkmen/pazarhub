// Mock Location Data Hierarchy
// City -> District -> Neighborhood -> Street

export interface StreetData {
    id: string;
    name: string;
}

export interface NeighborhoodData {
    id: string;
    name: string;
    streets?: StreetData[];
}

export interface DistrictData {
    id: string;
    name: string;
    neighborhoods?: NeighborhoodData[];
}

export interface CityData {
    id: string;
    name: string;
    districts?: DistrictData[];
}

// Minimal example data for location filtering demonstration
export const LOCATION_DATA: CityData[] = [
    {
        id: '34',
        name: 'İstanbul',
        districts: [
            {
                id: '34-1',
                name: 'Kadıköy',
                neighborhoods: [
                    {
                        id: '34-1-1',
                        name: 'Caferağa',
                        streets: [
                            { id: '34-1-1-1', name: 'Mühürdar Cad.' },
                            { id: '34-1-1-2', name: 'Bahariye Cad.' },
                            { id: '34-1-1-3', name: 'Moda Cad.' },
                        ]
                    },
                    {
                        id: '34-1-2',
                        name: 'Caddebostan',
                        streets: [
                            { id: '34-1-2-1', name: 'Bağdat Cad.' },
                            { id: '34-1-2-2', name: 'Plaj Yolu Sok.' },
                            { id: '34-1-2-3', name: 'İskele Sok.' },
                        ]
                    }
                ]
            },
            {
                id: '34-2',
                name: 'Beşiktaş',
                neighborhoods: [
                    {
                        id: '34-2-1',
                        name: 'Levent',
                        streets: [
                            { id: '34-2-1-1', name: 'Büyükdere Cad.' },
                            { id: '34-2-1-2', name: 'Sümbül Sok.' },
                        ]
                    },
                    {
                        id: '34-2-2',
                        name: 'Bebek',
                        streets: [
                            { id: '34-2-2-1', name: 'Cevdet Paşa Cad.' },
                            { id: '34-2-2-2', name: 'İnşirah Sok.' },
                        ]
                    }
                ]
            },
            {
                id: '34-3',
                name: 'Ataşehir',
                neighborhoods: [
                    {
                        id: '34-3-1',
                        name: 'Barbaros',
                        streets: [
                            { id: '34-3-1-1', name: 'Ataşehir Blv.' },
                            { id: '34-3-1-2', name: 'Kent Sok.' },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: '06',
        name: 'Ankara',
        districts: [
            {
                id: '06-1',
                name: 'Çankaya',
                neighborhoods: [
                    {
                        id: '06-1-1',
                        name: 'Oran',
                        streets: [
                            { id: '06-1-1-1', name: 'Turan Güneş Blv.' },
                            { id: '06-1-1-2', name: 'Kudüs Cad.' },
                        ]
                    },
                    {
                        id: '06-1-2',
                        name: 'Bahçelievler',
                        streets: [
                            { id: '06-1-2-1', name: 'Aşkabat Cad. (7. Cadde)' },
                            { id: '06-1-2-2', name: 'Bosna Hersek Cad.' },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: '35',
        name: 'İzmir',
        districts: [
            {
                id: '35-1',
                name: 'Konak',
                neighborhoods: [
                    {
                        id: '35-1-1',
                        name: 'Alsancak',
                        streets: [
                            { id: '35-1-1-1', name: 'Kıbrıs Şehitleri Cad.' },
                            { id: '35-1-1-2', name: 'Plevne Bulvarı' },
                        ]
                    }
                ]
            },
            {
                id: '35-2',
                name: 'Bornova',
                neighborhoods: [
                    {
                        id: '35-2-1',
                        name: 'Erzene',
                        streets: [
                            { id: '35-2-1-1', name: 'Mustafa Kemal Cad.' },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: '07',
        name: 'Antalya',
        districts: [
            {
                id: '07-1',
                name: 'Konyaaltı',
                neighborhoods: [
                    {
                        id: '07-1-1',
                        name: 'Liman',
                        streets: [
                            { id: '07-1-1-1', name: 'Akdeniz Blv.' },
                            { id: '07-1-1-2', name: 'Boğaçayı Cad.' },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: '16',
        name: 'Bursa',
        districts: [
            {
                id: '16-1',
                name: 'Nilüfer',
                neighborhoods: [
                    {
                        id: '16-1-1',
                        name: 'Görükle',
                        streets: [
                            { id: '16-1-1-1', name: 'Atatürk Cad.' },
                            { id: '16-1-1-2', name: 'Üniversite Sk.' },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: '26',
        name: 'Eskişehir',
        districts: [
            {
                id: '26-1',
                name: 'Tepebaşı',
                neighborhoods: [
                    {
                        id: '26-1-1',
                        name: 'Batıkent',
                        streets: [
                            { id: '26-1-1-1', name: 'Bülent Ecevit Blv.' },
                            { id: '26-1-1-2', name: 'Ulusal Egemenlik Blv.' },
                        ]
                    }
                ]
            }
        ]
    }
];
