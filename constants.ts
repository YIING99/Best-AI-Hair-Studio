import { Gender, HairStyle } from './types';

// Using clear text-based placeholders to represent "Schematic" images
const getSchematicUrl = (text: string) => 
  `https://placehold.co/600x400/1e293b/94a3b8?text=${encodeURIComponent(text)}&font=playfair-display`;

export const PRESET_STYLES: HairStyle[] = [
  {
    id: 'f-bob',
    name: 'Classic Bob',
    nameZh: '经典波波头',
    description: 'a sleek, chin-length bob cut',
    descriptionZh: '齐下巴的顺滑波波头',
    gender: Gender.FEMALE,
    imageUrl: getSchematicUrl('Classic Bob')
  },
  {
    id: 'f-long-wavy',
    name: 'Long Waves',
    nameZh: '长卷发',
    description: 'long, voluminous wavy hair',
    descriptionZh: '蓬松的长卷发',
    gender: Gender.FEMALE,
    imageUrl: getSchematicUrl('Long Waves')
  },
  {
    id: 'f-pixie',
    name: 'Pixie Cut',
    nameZh: '精灵短发',
    description: 'a short, textured pixie cut',
    descriptionZh: '层次感丰富的超短发',
    gender: Gender.FEMALE,
    imageUrl: getSchematicUrl('Pixie Cut')
  },
  {
    id: 'f-bangs',
    name: 'Straight with Bangs',
    nameZh: '齐刘海直发',
    description: 'long straight hair with forehead bangs',
    descriptionZh: '带刘海的长直发',
    gender: Gender.FEMALE,
    imageUrl: getSchematicUrl('Straight + Bangs')
  },
  {
    id: 'm-undercut',
    name: 'Modern Undercut',
    nameZh: '现代底切',
    description: 'short sides with a textured top undercut',
    descriptionZh: '两侧铲短，顶部留长的底切发型',
    gender: Gender.MALE,
    imageUrl: getSchematicUrl('Undercut')
  },
  {
    id: 'm-buzz',
    name: 'Buzz Cut',
    nameZh: '寸头',
    description: 'a very short military-style buzz cut',
    descriptionZh: '极短的军旅风寸头',
    gender: Gender.MALE,
    imageUrl: getSchematicUrl('Buzz Cut')
  },
  {
    id: 'm-pompadour',
    name: 'Pompadour',
    nameZh: '庞毕度背头',
    description: 'voluminous swept-back pompadour style',
    descriptionZh: '蓬松向后梳的复古油头',
    gender: Gender.MALE,
    imageUrl: getSchematicUrl('Pompadour')
  },
  {
    id: 'm-messy',
    name: 'Messy Quiff',
    nameZh: '凌乱飞机头',
    description: 'casual messy quiff hairstyle',
    descriptionZh: '随性凌乱的前额上梳发型',
    gender: Gender.MALE,
    imageUrl: getSchematicUrl('Messy Quiff')
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
    color_custom: 'Custom',
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
    color_custom: '自定义',
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