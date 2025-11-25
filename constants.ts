
import { Gender, HairStyle } from './types';

// Helper to generate a consistent photorealistic image URL based on description
// Using a deterministic seed based on the ID ensures the image remains the same across reloads
const getStyleImageUrl = (description: string, gender: Gender, id: string) => {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Updated to 'Asian' model to match the localized context and generally reliable AI generation for these features
  const genderTerm = gender === Gender.MALE ? 'handsome Asian male model' : 'beautiful Asian female model';
  // More specific prompt for salon-style quality
  const prompt = `close-up professional salon photography of ${genderTerm} with ${description} hairstyle, neutral studio background, soft lighting, 8k, highly detailed hair texture, looking at camera`;
  // Using 'flux' model for better realism
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=400&nologo=true&seed=${seed}&model=flux`;
};

export const PRESET_STYLES: HairStyle[] = [
  // --- Female Styles ---
  {
    id: 'f-bob',
    name: 'Classic Bob',
    nameZh: '经典波波头',
    description: 'sleek chin-length bob cut hairstyle',
    descriptionZh: '齐下巴的顺滑波波头',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('sleek chin-length bob cut', Gender.FEMALE, 'f-bob')
  },
  {
    id: 'f-long-wavy',
    name: 'Long Waves',
    nameZh: '长卷发',
    description: 'long voluminous wavy hairstyle',
    descriptionZh: '蓬松的长卷发',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('long voluminous wavy hair', Gender.FEMALE, 'f-long-wavy')
  },
  {
    id: 'f-pixie',
    name: 'Pixie Cut',
    nameZh: '精灵短发',
    description: 'short textured pixie cut hairstyle',
    descriptionZh: '层次感丰富的超短发',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('short textured pixie cut', Gender.FEMALE, 'f-pixie')
  },
  {
    id: 'f-bangs',
    name: 'Straight with Bangs',
    nameZh: '齐刘海直发',
    description: 'long straight hair with blunt bangs',
    descriptionZh: '带刘海的长直发',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('long straight hair with blunt bangs', Gender.FEMALE, 'f-bangs')
  },
  {
    id: 'f-curtain-bangs',
    name: 'Curtain Bangs Layers',
    nameZh: '八字刘海层次长发',
    description: 'long layered hair with curtain bangs',
    descriptionZh: '带有修饰脸型的八字刘海的长层次发',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('long layered hair with curtain bangs', Gender.FEMALE, 'f-curtain-bangs')
  },
  {
    id: 'f-wolf',
    name: 'Wolf Cut',
    nameZh: '鲻鱼头/狼尾',
    description: 'trendy wolf cut with shaggy layers',
    descriptionZh: '时髦的狼尾剪，带有蓬松层次和刘海',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('trendy wolf cut hairstyle', Gender.FEMALE, 'f-wolf')
  },
  {
    id: 'f-shag',
    name: 'Modern Shag',
    nameZh: '现代复古碎发',
    description: 'textured shag cut with choppy layers',
    descriptionZh: '带有凌乱层次感的现代复古碎发(Shag)',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('textured shag haircut', Gender.FEMALE, 'f-shag')
  },
  {
    id: 'f-hime',
    name: 'Hime Cut',
    nameZh: '公主切',
    description: 'straight hair with hime cut sidelocks',
    descriptionZh: '带有侧发和刘海的公主切直发',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('Japanese Hime cut hairstyle', Gender.FEMALE, 'f-hime')
  },
  {
    id: 'f-layered',
    name: 'Long Layers',
    nameZh: '长碎发',
    description: 'long hair with face-framing layers',
    descriptionZh: '修饰脸型的长碎发',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('long hair with face-framing layers', Gender.FEMALE, 'f-layered')
  },
  {
    id: 'f-asym-bob',
    name: 'Asymmetrical Bob',
    nameZh: '不对称波波头',
    description: 'asymmetrical bob cut longer on one side',
    descriptionZh: '一边长一边短的不对称波波头',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('asymmetrical bob hairstyle', Gender.FEMALE, 'f-asym-bob')
  },
  {
    id: 'f-beach-waves',
    name: 'Beach Waves',
    nameZh: '海滩波浪卷',
    description: 'loose tousled beach waves hairstyle',
    descriptionZh: '慵懒随性的海滩波浪卷',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('loose beach waves hair', Gender.FEMALE, 'f-beach-waves')
  },
  {
    id: 'f-ponytail',
    name: 'Sleek High Ponytail',
    nameZh: '干练高马尾',
    description: 'sleek high ponytail hairstyle',
    descriptionZh: '向后梳得光洁利落的高马尾',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('sleek high ponytail', Gender.FEMALE, 'f-ponytail')
  },
  {
    id: 'f-space-buns',
    name: 'Space Buns',
    nameZh: '双丸子头/哪吒头',
    description: 'double space buns hairstyle',
    descriptionZh: '头顶两侧的双丸子头',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('double space buns hairstyle', Gender.FEMALE, 'f-space-buns')
  },
  {
    id: 'f-afro',
    name: 'Afro',
    nameZh: '爆炸头',
    description: 'voluminous natural afro hairstyle',
    descriptionZh: '自然的蓬松爆炸头',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('voluminous afro hairstyle', Gender.FEMALE, 'f-afro')
  },
  {
    id: 'f-braids',
    name: 'Box Braids',
    nameZh: '脏辫/编发',
    description: 'long box braids hairstyle',
    descriptionZh: '长款非洲编发',
    gender: Gender.FEMALE,
    imageUrl: getStyleImageUrl('long box braids hairstyle', Gender.FEMALE, 'f-braids')
  },

  // --- Male Styles ---
  {
    id: 'm-undercut',
    name: 'Modern Undercut',
    nameZh: '现代底切',
    description: 'modern undercut hairstyle short sides',
    descriptionZh: '两侧铲短，顶部留长的底切发型',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('modern undercut men hairstyle', Gender.MALE, 'm-undercut')
  },
  {
    id: 'm-crop',
    name: 'Textured Crop',
    nameZh: '纹理短发',
    description: 'textured crop haircut with blunt fringe',
    descriptionZh: '带有平刘海的纹理感短发(French Crop)',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('textured crop haircut men', Gender.MALE, 'm-crop')
  },
  {
    id: 'm-buzz',
    name: 'Buzz Cut',
    nameZh: '寸头',
    description: 'short military buzz cut',
    descriptionZh: '极短的军旅风寸头',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('military buzz cut men', Gender.MALE, 'm-buzz')
  },
  {
    id: 'm-pompadour',
    name: 'Pompadour',
    nameZh: '庞毕度背头',
    description: 'voluminous pompadour hairstyle',
    descriptionZh: '蓬松向后梳的复古油头',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('pompadour hairstyle men', Gender.MALE, 'm-pompadour')
  },
  {
    id: 'm-curtains',
    name: '90s Curtains',
    nameZh: '中分刘海',
    description: '90s middle part curtains hairstyle',
    descriptionZh: '90年代复古中分发型',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('90s curtains hairstyle men', Gender.MALE, 'm-curtains')
  },
  {
    id: 'm-messy',
    name: 'Messy Quiff',
    nameZh: '凌乱飞机头',
    description: 'messy quiff hairstyle',
    descriptionZh: '随性凌乱的前额上梳发型',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('messy quiff hairstyle men', Gender.MALE, 'm-messy')
  },
  {
    id: 'm-sidepart',
    name: 'Classic Side Part',
    nameZh: '经典侧分',
    description: 'classic professional side part hairstyle',
    descriptionZh: '干练职业的经典侧分',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('classic side part men haircut', Gender.MALE, 'm-sidepart')
  },
  {
    id: 'm-mullet',
    name: 'Modern Mullet',
    nameZh: '现代狼尾',
    description: 'modern mullet hairstyle',
    descriptionZh: '两侧较短，后面较长的现代狼尾',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('modern mullet hairstyle men', Gender.MALE, 'm-mullet')
  },
  {
    id: 'm-fade',
    name: 'Fade with Design',
    nameZh: '渐变刻痕',
    description: 'skin fade haircut with line design',
    descriptionZh: '带有线条设计的渐变铲青',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('skin fade haircut with design', Gender.MALE, 'm-fade')
  },
  {
    id: 'm-manbun',
    name: 'Man Bun',
    nameZh: '男士丸子头',
    description: 'man bun top knot hairstyle',
    descriptionZh: '顶部扎起的丸子头',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('man bun hairstyle', Gender.MALE, 'm-manbun')
  },
  {
    id: 'm-two-block',
    name: 'Two Block Cut',
    nameZh: '韩式二分区',
    description: 'korean two block haircut',
    descriptionZh: '两侧铲青顶部留长的韩式二分区发型',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('korean two block haircut men', Gender.MALE, 'm-two-block')
  },
  {
    id: 'm-faux-hawk',
    name: 'Faux Hawk',
    nameZh: '仿莫西干',
    description: 'faux hawk hairstyle',
    descriptionZh: '两侧短顶部竖起的仿莫西干发型',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('faux hawk hairstyle men', Gender.MALE, 'm-faux-hawk')
  },
  {
    id: 'm-dreads',
    name: 'Short Dreads',
    nameZh: '短脏辫',
    description: 'short dreadlocks men',
    descriptionZh: '短款脏辫',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('short dreadlocks men', Gender.MALE, 'm-dreads')
  },
  {
    id: 'm-cornrows',
    name: 'Cornrows',
    nameZh: '贴头辫',
    description: 'cornrows braids men',
    descriptionZh: '紧贴头皮的非洲编发(Cornrows)',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('cornrows braids men', Gender.MALE, 'm-cornrows')
  },
  {
    id: 'm-slicked',
    name: 'Slicked Back',
    nameZh: '大背头',
    description: 'slicked back hairstyle men',
    descriptionZh: '经典高光大背头',
    gender: Gender.MALE,
    imageUrl: getStyleImageUrl('slicked back hairstyle men', Gender.MALE, 'm-slicked')
  }
];

export const HAIR_COLORS = [
  { name: 'Natural', value: '' },
  { name: 'Blonde', value: '#E6BE8A' },
  { name: 'Brown', value: '#4B3621' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#8D4004' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Blue', value: '#0000FF' },
];

export const PARTING_OPTIONS = [
    { label: 'Auto', value: 'auto' },
    { label: 'Center', value: 'center' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
    { label: 'No Part', value: 'none' },
];

export const BANGS_OPTIONS = [
    { label: 'Auto', value: 'auto' },
    { label: 'None', value: 'none' },
    { label: 'Curtain', value: 'curtain' },
    { label: 'Blunt', value: 'blunt' },
    { label: 'Wispy', value: 'wispy' },
    { label: 'Side', value: 'side' },
];

export const TRANSLATIONS = {
  en: {
    app_title: 'AI Hair Studio',
    powered_by: 'Powered by Google Gemini 2.5',
    tab_female: 'Female Styles',
    tab_male: 'Male Styles',
    library: 'Library',
    add_template: 'Add Template',
    fine_tune: 'Fine-Tune',
    hair_color: 'Hair Color',
    color_natural: 'Natural',
    color_custom: 'Custom HSL',
    hue: 'Hue',
    saturation: 'Saturation',
    lightness: 'Lightness',
    length: 'Length',
    short: 'Short',
    long: 'Long',
    curl: 'Curl',
    straight: 'Straight',
    coily: 'Coily',
    volume: 'Volume',
    flat: 'Flat',
    full: 'Full',
    parting: 'Parting',
    bangs: 'Bangs',
    age_label: 'Visual Age',
    age_young: 'Younger',
    age_old: 'Older',
    beard_label: 'Facial Hair / Beard',
    new_photo: 'New Photo',
    save_image: 'Save Image',
    share_image: 'Share',
    upload_label: 'Upload Photo',
    upload_hint: 'Click or drag & drop',
    upload_tip: 'Upload a clear photo facing the camera for best results.',
    original: 'Original',
    new_style: 'New Style',
    analyzing: 'Analyzing Face & Style...',
    generating: 'Applying Transformation...',
    generate_btn: 'Generate Look',
    regenerate_btn: 'Regenerate',
    history: 'History',
    save_config: 'Save Config',
    load_config: 'Load',
    config_name: 'Config Name',
    saved_configs: 'Saved Configs',
    delete: 'Delete',
    custom_template_name: 'Custom Template',
    error_no_face: 'No face detected or image unclear.',
    failed_generate: 'Failed to generate image.',
    failed_analyze: 'Failed to analyze template.',
    recommended_badge: 'Best Match',
    face_shape_label: 'Detected Face Shape:',
    share_success: 'Image shared successfully!',
    share_fail: 'Sharing failed or not supported.'
  },
  zh: {
    app_title: 'AI 发型工作室',
    powered_by: '由 Google Gemini 2.5 提供支持',
    tab_female: '女士发型',
    tab_male: '男士发型',
    library: '发型库',
    add_template: '提取发型 / 添加模板',
    fine_tune: '细节调整',
    hair_color: '发色',
    color_natural: '自然色',
    color_custom: '自定义(HSL)',
    hue: '色相',
    saturation: '饱和度',
    lightness: '亮度',
    length: '长度',
    short: '短',
    long: '长',
    curl: '卷曲度',
    straight: '直',
    coily: '卷',
    volume: '蓬松度',
    flat: '贴头皮',
    full: '蓬松',
    parting: '分缝',
    bangs: '刘海',
    age_label: '视觉年龄',
    age_young: '年轻',
    age_old: '年长',
    beard_label: '胡须/面部毛发',
    new_photo: '重选照片',
    save_image: '保存图片',
    share_image: '分享',
    upload_label: '上传照片',
    upload_hint: '点击或拖拽上传',
    upload_tip: '为了最佳效果，请上传正面清晰的面部照片。',
    original: '原图',
    new_style: '效果图',
    analyzing: '正在分析脸型与发型...',
    generating: '正在生成新发型...',
    generate_btn: '一键换发型',
    regenerate_btn: '重新生成',
    history: '生成记录 / 对比',
    save_config: '保存参数',
    load_config: '应用',
    config_name: '参数名称',
    saved_configs: '已存参数',
    delete: '删除',
    custom_template_name: '自定义模板',
    error_no_face: '未检测到人脸或图片不清晰。',
    failed_generate: '生成失败，请重试。',
    failed_analyze: '模板分析失败。',
    recommended_badge: 'AI 推荐',
    face_shape_label: '检测脸型：',
    share_success: '分享成功！',
    share_fail: '分享失败或不支持。'
  }
};
