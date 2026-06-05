export default function QuickTips() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
      <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4 flex items-center gap-2">
        <span>💡</span>
        نصائح للتميز
      </h3>
      <ul className="space-y-3 text-gray-600 font-arabic text-sm">
        <li className="flex items-start gap-2">
          <span>✅</span>
          احرص على الحضور في موعدك
        </li>
        <li className="flex items-start gap-2">
          <span>📖</span>
          راجع حفظك يومياً
        </li>
        <li className="flex items-start gap-2">
          <span>🎯</span>
          ضع هدفاً للحفظ كل أسبوع
        </li>
        <li className="flex items-start gap-2">
          <span>🤲</span>
          ادع الله بالتوفيق
        </li>
      </ul>
    </div>
  );
}
