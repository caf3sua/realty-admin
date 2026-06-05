export interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  developer: string;
  description: string;
  shortDescription: string;
  image: string;
  banner: string;
  status: 'Đang mở bán' | 'Sắp mở bán' | 'Đã bàn giao';
  scale: string;
  priceRange: string;
  tags: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number; // Tỷ VNĐ
  pricePerSqm?: number; // Triệu/m2
  area: number; // m2
  bedrooms: number;
  bathrooms: number;
  location: string;
  description: string;
  projectSlug: string; // "ocean-park-1", "ocean-park-2", "ha-long-xanh", "ngoai-du-an"
  productType: 'villa' | 'townhouse' | 'apartment' | 'residential' | 'shophouse';
  productTypeName: string;
  isPremium: boolean;
  developer?: string;
  images: string[];
  status: 'Còn hàng' | 'Đã cọc' | 'Đã bán' | 'Đang bán' | 'Sắp mở bán';
  direction: string;
  legal: string;
}

export interface Developer {
  id: string;
  name: string;
  logo: string;
  title: string;
  description: string;
  slug: string;
  linkText: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  phone: string;
  classification: string;
  address?: string;
  email?: string;
  source: string;
  needs?: string;
  note?: string;
  createdAt: string;
}

export interface Advisory {
  id: string;
  name: string;
  phone: string;
  details: string;
  productSlug?: string;
  productName?: string;
  status: string;
  createdAt: string;
}

export interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
  active: boolean;
}

// Initial Mock Developers
export const mockDevelopers: Developer[] = [
  {
    id: 'dev-1',
    name: 'Masterise Homes',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&h=100&q=80',
    title: 'Phong Cách Sống Hàng Hiệu',
    description: 'Nhà phát triển bất động sản hàng hiệu hàng đầu Việt Nam, hợp tác cùng các đối tác toàn cầu như Elie Saab, Marriott International. Kiến tạo giá trị sống trường tồn và dịch vụ quản lý chất lượng thế giới.',
    slug: 'masterise-homes',
    linkText: 'Xem Các Căn Hộ Masterise Homes'
  },
  {
    id: 'dev-2',
    name: 'MIK Group',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=100&h=100&q=80',
    title: 'Chuẩn Mực Sống Sang Trọng',
    description: 'Nổi tiếng với định vị dòng sản phẩm hạng sang The Matrix One và Imperia, MIK Group kiến tạo các giá trị sống bền vững, thiết kế xanh hài hòa thiên nhiên kết hợp công nghệ thông minh thời thượng.',
    slug: 'mik-group',
    linkText: 'Xem Các Căn Hộ MIK Group'
  },
  {
    id: 'dev-3',
    name: 'Vinhomes',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&h=100&q=80',
    title: 'Đại Đô Thị Biển Quốc Tế',
    description: 'Thương hiệu bất động sản số 1 Việt Nam, nổi bật với các siêu dự án đô thị sinh thái kết hợp biển hồ nhân tạo kỳ vĩ, quy hoạch đồng bộ "Tất cả trong một" kiến tạo chuẩn mực sống văn minh hiện đại hàng đầu.',
    slug: 'vinhomes',
    linkText: 'Xem Các Sản Phẩm Vinhomes'
  },
  {
    id: 'dev-4',
    name: 'Sun Group',
    logo: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=100&h=100&q=80',
    title: 'Kiệt Tác Nghỉ Dưỡng Độc Bản',
    description: 'Tập đoàn hàng đầu trong phát triển bất động sản gắn liền với du lịch nghỉ dưỡng cao cấp, shophouse phong cách nghệ thuật Địa Trung Hải và các dinh thiện biển tráng lệ hòa mình cùng thiên nhiên kỳ vĩ.',
    slug: 'sun-group',
    linkText: 'Xem Các Sản Phẩm Sun Group'
  }
];

// Initial Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Vinhomes Ocean Park 1',
    slug: 'ocean-park-1',
    location: 'Gia Lâm, Hà Nội',
    developer: 'Vinhomes',
    shortDescription: 'Thành phố Biển hồ - Nơi mang biển xanh cát trắng vào lòng Hà Nội với hồ nước mặn nhân tạo rộng lớn.',
    description: 'Vinhomes Ocean Park 1 sở hữu đại tiện ích độc đáo gồm Biển hồ nước mặn 6,1ha và Hồ Ngọc Trai cát trắng 24,5ha. Dự án được quy hoạch đồng bộ mang tầm cỡ quốc tế, cung cấp đa dạng dòng sản phẩm từ căn hộ chung cư cao cấp đến các căn biệt thự, liền kề, shophouse đẳng cấp.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&h=400&q=80',
    banner: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=400&q=80',
    status: 'Đã bàn giao',
    scale: '420 ha',
    priceRange: '2.5 tỷ - 120 tỷ',
    tags: ['Biển hồ nhân tạo', 'Hồ nước ngọt lớn', 'Gia Lâm', 'Vinhomes']
  },
  {
    id: 'proj-2',
    name: 'Vinhomes Ocean Park 2',
    slug: 'ocean-park-2',
    location: 'Văn Giang, Hưng Yên',
    developer: 'Vinhomes',
    shortDescription: 'Kinh đô Ánh sáng - Siêu quần thể đô thị biển quy mô 1.000 ha với công viên sóng Royal Wave Park quy mô nhất.',
    description: 'Vinhomes Ocean Park 2 (The Empire) là giai đoạn 2 của siêu quần thể đô thị biển Vinhomes, nổi bật với Tổ hợp công viên Biển tạo sóng nhân tạo Royal Wave Park lớn nhất thế giới (18ha). Dự án bao gồm các phân khu mang phong cách kiến trúc đa dạng từ Pháp, Ý, Địa Trung Hải đến Đông Dương.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&h=400&q=80',
    banner: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=400&q=80',
    status: 'Đang mở bán',
    scale: '458 ha',
    priceRange: '6 tỷ - 150 tỷ',
    tags: ['Công viên sóng', 'Kinh đô ánh sáng', 'Biệt thự tân cổ điển', 'Vinhomes']
  },
  {
    id: 'proj-3',
    name: 'Vinhomes Hạ Long Xanh',
    slug: 'ha-long-xanh',
    location: 'Quảng Yên & Hạ Long, Quảng Ninh',
    developer: 'Vinhomes',
    shortDescription: 'Đại đô thị sinh thái thông minh, vịnh biển kỳ quan của tương lai với quy mô hơn 4.100 ha.',
    description: 'Vinhomes Hạ Long Xanh là siêu dự án phức hợp mang tính biểu tượng tại Quảng Ninh. Tọa lạc tại vị trí vàng kết nối trực tiếp cao tốc Hải Phòng - Hạ Long, dự án tích hợp hệ sinh thái nghỉ dưỡng, sân golf 18 lỗ, công viên chủ đề Safari, bến du thuyền quốc tế và các khu đô thị sinh thái hiện đại bậc nhất châu Á.',
    image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&h=400&q=80',
    banner: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&h=400&q=80',
    status: 'Sắp mở bán',
    scale: '4.109 ha',
    priceRange: 'Liên hệ',
    tags: ['Siêu dự án 4100ha', 'Sân Golf', 'Bến du thuyền', 'Kỳ quan tương lai']
  },
  {
    id: 'proj-4',
    name: 'Masteri West Heights',
    slug: 'masteri-west-heights',
    location: 'Tây Mỗ, Nam Từ Liêm, Hà Nội',
    developer: 'Masterise Homes',
    shortDescription: 'Căn hộ wellness cao cấp chuẩn quốc tế tọa lạc tại trung tâm đại đô thị thông minh Smart City.',
    description: 'Masteri West Heights kiến tạo một không gian sống chuẩn wellness đẳng cấp quốc tế tại trung tâm Smart City Hà Nội. Với 4 tòa căn hộ cao cấp sở hữu tầm nhìn trực diện ra hồ trung tâm 4.8ha, dự án mang lại chuỗi 22 tiện ích đặc quyền trong nhà và ngoài trời cực kỳ xa hoa.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&h=400&q=80',
    banner: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=400&q=80',
    status: 'Đang mở bán',
    scale: '2.1 ha',
    priceRange: '3.2 tỷ - 9.5 tỷ',
    tags: ['Luxury Apartment', 'Smart City', 'Masterise Homes', 'Căn hộ Wellness']
  },
  {
    id: 'proj-5',
    name: 'The Matrix One',
    slug: 'the-matrix-one',
    location: 'Mễ Trì, Nam Từ Liêm, Hà Nội',
    developer: 'MIK Group',
    shortDescription: 'Tổ hợp căn hộ hạng sang, biểu tượng sống mới tại trung tâm kinh tế - hành chính Mỹ Đình.',
    description: 'The Matrix One là tổ hợp căn hộ siêu sang do MIK Group phát triển. Dự án nằm tại ngã tư Lê Quang Đạo - Mễ Trì, sở hữu tầm nhìn panorama triệu đô hướng ra công viên hồ điều hòa 14ha và đường đua F1 cũ. Dự án mang tiêu chuẩn bàn giao khắt khe nhất thế giới.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&h=400&q=80',
    banner: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=400&q=80',
    status: 'Đã bàn giao',
    scale: '39.8 ha (toàn khu)',
    priceRange: '5.5 tỷ - 25 tỷ',
    tags: ['Căn hộ siêu sang', 'Mỹ Đình', 'MIK Group', 'View công viên 14ha']
  },
  {
    id: 'proj-6',
    name: 'Sun Premier Village Primavera',
    slug: 'sun-primavera',
    location: 'An Thới, Phú Quốc, Kiên Giang',
    developer: 'Sun Group',
    shortDescription: 'Thị trấn Địa Trung Hải phồn hoa - Biểu tượng kiến trúc nghệ thuật và nghỉ dưỡng đẳng cấp bên bờ Nam đảo ngọc.',
    description: 'Sun Premier Village Primavera sở hữu vị trí đắc địa tại ga đi cáp treo Hòn Thơm, Phú Quốc. Dự án tái hiện một thị trấn ven biển Địa Trung Hải rực rỡ sắc màu với những căn shophouse thoải dần về phía biển, các quảng trường nghệ thuật lớn và công trình biểu tượng Cầu Hôn (Kiss Bridge).',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=400&q=80',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=400&q=80',
    status: 'Đã bàn giao',
    scale: '39.3 ha',
    priceRange: '18 tỷ - 85 tỷ',
    tags: ['Địa Trung Hải', 'Phú Quốc', 'Sun Group', 'Cận biển']
  }
];

// Initial Mock Products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Biệt Thự Đơn Lập Ngọc Trai Siêu VIP - View Trực Diện Biển Hồ Ngọc Trai',
    slug: 'biet-thu-don-lap-ngoc-trai-view-bien-ho',
    price: 95.0,
    pricePerSqm: 316.6,
    area: 300,
    bedrooms: 5,
    bathrooms: 6,
    location: 'Phân khu Ngọc Trai, Vinhomes Ocean Park 1',
    description: 'Siêu phẩm biệt thự đơn lập phân khu Ngọc Trai - phân khu khép kín (compound) vip nhất Vinhomes Ocean Park 1. Căn biệt thự sở hữu vị trí góc đắc địa, tầm nhìn trực diện hồ điều hòa cát trắng 24.5ha. Thiết kế kiến trúc Địa Trung Hải phóng khoáng, sang trọng với khoảng sân vườn rộng lớn bao quanh, hầm rượu và bể bơi trong nhà.',
    projectSlug: 'ocean-park-1',
    productType: 'villa',
    productTypeName: 'Biệt thự',
    isPremium: true,
    developer: 'Vinhomes',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Còn hàng',
    direction: 'Đông Nam',
    legal: 'Sổ đỏ lâu dài'
  },
  {
    id: 'prod-2',
    title: 'Biệt Thự Song Lập San Hô Kế Cận Công Viên Sóng Royal Wave Park',
    slug: 'biet-thu-song-lap-san-ho-gan-cong-vien-song',
    price: 18.5,
    pricePerSqm: 123.3,
    area: 150,
    bedrooms: 4,
    bathrooms: 5,
    location: 'Phân khu San Hô, Vinhomes Ocean Park 2',
    description: 'Biệt thự song lập hoàn thiện thô phân khu San Hô tại Ocean Park 2. Vị trí vô cùng đắc địa, chỉ vài bước chân là ra tới đại công viên tạo sóng Royal Wave Park 18ha. Thiết kế phong cách Đông Dương (Indochine) độc đáo, tối ưu hóa công năng sử dụng với ban công kính rộng và cửa sổ lớn đón ánh sáng tự nhiên.',
    projectSlug: 'ocean-park-2',
    productType: 'villa',
    productTypeName: 'Biệt thự',
    isPremium: false,
    developer: 'Vinhomes',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Còn hàng',
    direction: 'Nam',
    legal: 'Hợp đồng mua bán'
  },
  {
    id: 'prod-3',
    title: 'Căn Hộ Panorama Masteri West Heights - Tòa A View Trọn Hồ Trung Tâm',
    slug: 'can-ho-panorama-masteri-west-heights-toa-a',
    price: 4.8,
    pricePerSqm: 68.5,
    area: 70,
    bedrooms: 2,
    bathrooms: 2,
    location: 'Tòa A Masteri West Heights, Smart City, Hà Nội',
    description: 'Căn hộ 2 phòng ngủ 2 WC đẳng cấp tại dự án Masteri West Heights. Căn hộ ở tầng cao trung bình, sở hữu tầm nhìn trực diện và không góc chết ra hồ điều hòa trung tâm 4.8ha. Bàn giao đầy đủ thiết bị nội thất liền tường cao cấp từ các thương hiệu Kohler, Hafele, Daikin. Chủ sở hữu được tận hưởng bể bơi vô cực trên tầng thượng tòa nhà.',
    projectSlug: 'masteri-west-heights',
    productType: 'apartment',
    productTypeName: 'Căn hộ',
    isPremium: true,
    developer: 'Masterise Homes',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Còn hàng',
    direction: 'Đông Bắc',
    legal: 'Sổ đỏ lâu dài'
  },
  {
    id: 'prod-4',
    title: 'Căn Hộ Dual-Key Cao Cấp The Matrix One Mỹ Đình - Ban Công Panorama',
    slug: 'can-ho-dual-key-the-matrix-one-my-dinh',
    price: 9.2,
    pricePerSqm: 82.1,
    area: 112,
    bedrooms: 3,
    bathrooms: 3,
    location: 'Tòa B The Matrix One, Mỹ Đình, Hà Nội',
    description: 'Căn hộ Dual-Key độc đáo tại The Matrix One, vừa thích hợp để ở vừa có thể cho thuê tạo dòng tiền ổn định. Thiết kế chia làm 2 lối đi riêng biệt dẫn vào căn studio và căn hộ 2 phòng ngủ. Toàn bộ căn hộ sử dụng kính hộp Triple Low-E chạm sàn cao cấp nhất, ngắm trọn vẹn hồ điều hòa 14ha và công viên Mỹ Đình.',
    projectSlug: 'the-matrix-one',
    productType: 'apartment',
    productTypeName: 'Căn hộ',
    isPremium: true,
    developer: 'MIK Group',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Đã cọc',
    direction: 'Tây Nam',
    legal: 'Sổ đỏ lâu dài'
  },
  {
    id: 'prod-5',
    title: 'Nhà Phố Liền Kề Sao Biển - Vừa Ở Vừa Kinh Doanh Đắc Địa',
    slug: 'nha-pho-lien-ke-sao-bien-vinhomes-ocean-park-2',
    price: 12.5,
    pricePerSqm: 138.8,
    area: 90,
    bedrooms: 4,
    bathrooms: 5,
    location: 'Phân khu Sao Biển, Vinhomes Ocean Park 2',
    description: 'Nhà phố liền kề / Shophouse phân khu Sao Biển tại Vinhomes Ocean Park 2. Trục đường giao thông chính thông thoáng, thuận tiện kinh doanh dịch vụ ăn uống, thời trang hoặc làm văn phòng đại diện. Thiết kế phong cách Pháp cổ sang trọng 5 tầng, mặt tiền 5m cực thoáng.',
    projectSlug: 'ocean-park-2',
    productType: 'townhouse',
    productTypeName: 'Liền kề',
    isPremium: false,
    developer: 'Vinhomes',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Còn hàng',
    direction: 'Đông Nam',
    legal: 'Sổ đỏ lâu dài'
  }
];

export class MockDatabase {
  static init() {
    if (!localStorage.getItem('admin_developers')) {
      localStorage.setItem('admin_developers', JSON.stringify(mockDevelopers));
    }
    if (!localStorage.getItem('admin_projects')) {
      localStorage.setItem('admin_projects', JSON.stringify(mockProjects));
    }
    if (!localStorage.getItem('admin_products')) {
      localStorage.setItem('admin_products', JSON.stringify(mockProducts));
    }
    if (!localStorage.getItem('admin_users')) {
      const mockUsers: User[] = [
        {
          id: 'user-1',
          name: 'Nguyễn Văn Admin',
          email: 'admin@realty.com',
          role: 'admin',
          status: 'active',
          createdAt: '2026-01-15'
        },
        {
          id: 'user-2',
          name: 'Trần Thị Nhân Viên',
          email: 'staff@realty.com',
          role: 'staff',
          status: 'active',
          createdAt: '2026-02-20'
        },
        {
          id: 'user-3',
          name: 'Lê Văn Khóa',
          email: 'locked@realty.com',
          role: 'staff',
          status: 'inactive',
          createdAt: '2026-03-10'
        }
      ];
      localStorage.setItem('admin_users', JSON.stringify(mockUsers));
    }
  }

  // Developers
  static getDevelopers(): Developer[] {
    this.init();
    return JSON.parse(localStorage.getItem('admin_developers') || '[]');
  }
  static saveDevelopers(data: Developer[]) {
    localStorage.setItem('admin_developers', JSON.stringify(data));
  }

  // Projects
  static getProjects(): Project[] {
    this.init();
    return JSON.parse(localStorage.getItem('admin_projects') || '[]');
  }
  static saveProjects(data: Project[]) {
    localStorage.setItem('admin_projects', JSON.stringify(data));
  }

  // Products
  static getProducts(): Product[] {
    this.init();
    return JSON.parse(localStorage.getItem('admin_products') || '[]');
  }
  static saveProducts(data: Product[]) {
    localStorage.setItem('admin_products', JSON.stringify(data));
  }

  // Users
  static getUsers(): User[] {
    this.init();
    return JSON.parse(localStorage.getItem('admin_users') || '[]');
  }
  static saveUsers(data: User[]) {
    localStorage.setItem('admin_users', JSON.stringify(data));
  }
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  publishedAt: string;
  category: 'Thị trường' | 'Quy hoạch' | 'Cẩm nang' | 'Dự án';
}

export type NewsPost = Post;

export const mockNews: NewsPost[] = [
  {
    id: 'news-1',
    title: 'Bất Động Sản Ven Biển Quảng Ninh Bứt Phá Nhờ Đòn Bẩy Hạ Tầng',
    slug: 'bat-dong-san-ven-bien-quang-ninh-but-pha-ha-tang',
    summary: 'Với việc hoàn thiện các tuyến cao tốc kết nối cùng dự án Hạ Long Xanh được đẩy mạnh triển khai, thị trường địa ốc Quảng Ninh đang trở thành thỏi nam châm thu hút dòng vốn đầu tư.',
    content: '<p>Thị trường bất động sản Quảng Ninh liên tục ghi nhận những tín hiệu tích cực trong thời gian qua. Động lực chính đến từ việc hoàn thiện đồng bộ hạ tầng giao thông kết nối liên vùng như cao tốc Hà Nội - Hải Phòng - Hạ Long - Vân Đồn - Móng Cái, sân bay quốc tế Vân Đồn và cảng tàu khách quốc tế Hạ Long.</p><p>Đặc biệt, siêu dự án Vinhomes Hạ Long Xanh quy mô lớn tại trục kinh tế ven biển Quảng Yên - Hạ Long khởi công xây dựng đã thổi một luồng sinh khí mới vào toàn khu vực. Giới chuyên gia nhận định, phân khúc biệt thự nghỉ dưỡng, shophouse thương mại ven biển sẽ là điểm sáng đầu tư trung và dài hạn nhờ khai thác tối đa tiềm năng du lịch 4 mùa của địa phương.</p>',
    image: '/images/ha-long-xanh-hero.png',
    publishedAt: '2026-05-25',
    category: 'Thị trường'
  },
  {
    id: 'news-2',
    title: 'Bí Quyết Mua Căn Hộ Chung Cư Cao Cấp Tránh Rủi Ro Pháp Lý',
    slug: 'bi-quyet-mua-can-ho-chung-cu-cao-cap-tranh-rui-ro-phap-ly',
    summary: 'Để không rơi vào cảnh "tiền mất tật mang", người mua nhà cần xem xét kỹ lưỡng hồ sơ pháp lý dự án, uy tín chủ đầu tư và các điều khoản trong hợp đồng mua bán.',
    content: '<p>Mua chung cư cao cấp là giao dịch có giá trị lớn, đòi hỏi khách hàng phải cực kỳ tỉnh táo trước khi đặt bút ký hợp đồng. Dưới đây là những lưu ý quan trọng để đảm bảo an toàn tài chính:</p><ul><li>Kiểm tra giấy phép xây dựng, quyết định giao đất và quy hoạch chi tiết 1/500 của dự án.</li><li>Kiểm tra văn bản chấp thuận đủ điều kiện bán nhà ở hình thành trong tương lai của Sở Xây dựng sở tại.</li><li>Tìm hiểu năng lực tài chính và uy tín của chủ đầu tư thông qua các dự án đã bàn giao trước đó (ví dụ như Vinhomes, Masterise Homes với tiến độ ra sổ nhanh chóng).</li><li>Đọc kỹ chính sách bảo lãnh ngân hàng cho dự án.</li></ul>',
    image: '/images/project-masteri.png',
    publishedAt: '2026-05-18',
    category: 'Cẩm nang'
  },
  {
    id: 'news-3',
    title: 'Bản Đồ Quy Hoạch Đô Thị Vệ Tinh Phía Đông Hà Nội Có Gì Mới?',
    slug: 'ban-do-quy-hoach-do-thi-ve-tinh-phia-dong-ha-noi',
    summary: 'Quy hoạch xây dựng thủ đô Hà Nội định hướng Gia Lâm và Văn Giang (Hưng Yên) trở thành những trung tâm đô thị sinh thái, tri thức hiện đại bậc nhất vùng thủ đô.',
    content: '<p>Khu vực phía Đông Hà Nội đang thay đổi diện mạo nhanh chóng từng ngày. Với chiến lược "đa cực" trong phát triển không gian thủ đô, trục phía Đông với tâm điểm Gia Lâm và khu vực giáp ranh Văn Giang (Hưng Yên) được quy hoạch là cực tăng trưởng kinh tế mới.</p><p>Sự xuất hiện của các đại đô thị tỷ đô như Vinhomes Ocean Park 1, 2 và sắp tới là các dự án hạ tầng cầu vượt sông Hồng (cầu Trần Hưng Đạo, cầu Giang Biên) sẽ thu hút hàng chục vạn cư dân dịch chuyển từ nội đô cũ ra ngoài, biến nơi đây thành khu vực sầm uất bậc nhất phía Bắc.</p>',
    image: '/images/project-op1-banner.png',
    publishedAt: '2026-05-12',
    category: 'Quy hoạch'
  }
];