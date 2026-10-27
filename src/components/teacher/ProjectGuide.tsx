import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  HelpCircle,
  FileText
} from 'lucide-react';

export const ProjectGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-100 text-sky-700 rounded-2xl">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-sky-600 tracking-wider">
              Hồ Sơ Khoa Học & Hướng Dẫn Triển Khai
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Dự Án: TOÁN KHỞI ĐẦU AI
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              Chạm số – Hiểu nhanh – Học vui • Sản phẩm tham dự AI Giáo dục Việt Nam 2026
            </p>
          </div>
        </div>

        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-900 space-y-1">
          <div><strong>Tác giả:</strong> Trịnh Thị Chung Thủy</div>
          <div><strong>Đơn vị:</strong> Trường Tiểu học Hiển Khánh, xã Hiển Khánh, tỉnh Ninh Bình</div>
          <div><strong>Đối tượng thực nghiệm:</strong> Lớp 1A3 – Năm học 2026–2027</div>
          <div><strong>Tên khoa học:</strong> Ứng dụng trí tuệ nhân tạo trong thiết kế trò chơi học tập tương tác và tổ chức dạy học Toán thích ứng nhằm phát triển năng lực toán học cho học sinh lớp 1.</div>
        </div>
      </div>

      {/* 5-Step Experimental Workflow */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-xs space-y-5">
        <h3 className="font-black text-lg text-slate-900">
          Quy Trình 5 Bước Tổ Chức Dạy Học Thích Ứng Cho Lớp 1A3
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 bg-sky-600 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">
                Khởi tạo danh sách lớp & Khảo sát năng lực đầu vào (Đề A)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Giáo viên nhập sĩ số thật lớp 1A3 (tạo mã H01, H02...). Tiến hành khảo sát năng lực ban đầu bằng Đề A để xác định điểm xuất phát của từng học sinh theo 10 chủ đề GDPT 2018.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">
                AI Đề xuất học liệu & Giáo viên kiểm duyệt (Xưởng Trò Chơi)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Giáo viên chọn bài học và mục tiêu cần đạt. Gemini 3.8 Flash phía máy chủ đề xuất bộ câu hỏi chuẩn toán học. Hệ thống tự động chạy bộ kiểm thử toán học (Rule VIII). Toàn bộ nội dung ở trạng thái <em>Chờ giáo viên duyệt</em> trước khi lưu vào ngân hàng.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">
                Phân hóa và giao nhiệm vụ thích ứng (Góc Toán Vui HTML5)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Học sinh mức Mầm Xanh nhận nhiệm vụ củng cố trực quan; mức Vươn Cao và Tỏa Sáng nhận bài rèn luyện và mở rộng. Trẻ thực hành trên Góc Toán Vui HTML5 hoàn toàn độc lập, an toàn, không có chatbot và không kết nối AI.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 bg-amber-600 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              4
            </span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">
                Tiếp nhận kết quả & Phân tích lỗi sai khách quan
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Giáo viên nhập file kết quả JSON từ thiết bị của học sinh về Trung tâm Quản lý. Hệ thống phân loại lỗi sai theo 8 nhóm quy tắc sư phạm (đếm thiếu/thừa, nhầm thứ tự số, sai phép tính...) để có biện pháp can thiệp kịp thời.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              5
            </span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">
                Đánh giá đối sánh sau can thiệp (Đề B) & Xuất minh chứng khoa học
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Sau thời gian rèn luyện, học sinh làm bài khảo sát Đề B tương đương. Hệ thống tự động tính toán mức chênh lệch, tỷ lệ tiến bộ và vẽ biểu đồ so sánh trước - sau, sẵn sàng xuất báo cáo CSV và PDF cho hồ sơ dự thi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security and Privacy Commitments */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-emerald-700">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="font-black text-base text-slate-900">
            Cam Kết Bảo Mật An Toàn Tuyệt Đối Cho Trẻ Em Lớp 1
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <strong>Không gửi dữ liệu cá nhân tới AI:</strong> Tuyệt đối không gửi tên, hình ảnh, giọng nói, địa chỉ hay số điện thoại của học sinh lên máy chủ AI.
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <strong>Cách ly hoàn toàn ứng dụng trẻ em:</strong> Ứng dụng Góc Toán Vui không chứa khóa API, không chứa SDK, có thể chạy 100% offline không cần internet.
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <strong>Không có chatbot tự do:</strong> Học sinh chỉ tương tác với các trò chơi toán học đã được giáo viên duyệt kỹ lưỡng.
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <strong>Toán học chuẩn xác:</strong> Mọi bài toán đều qua bộ kiểm thử tự động, không sinh phép nhân chia hay số âm vượt chương trình lớp 1.
          </div>
        </div>
      </div>
    </div>
  );
};
