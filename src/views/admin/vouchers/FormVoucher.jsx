import { useState, useEffect } from 'react';
import { useCreateVoucherMutation, useUpdateVoucherMutation } from '../../../services/voucher.service';
import { toast } from 'react-hot-toast';

const FormVoucher = ({ open, onClose, onSuccess, voucher }) => {
  const isEdit = !!voucher;
  const [form, setForm] = useState({
    code: '',
    usage_limit: 1,
    start_date: '',
    end_date: '',
    is_free_shipping: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({});

  const [createVoucher] = useCreateVoucherMutation();
  const [updateVoucher] = useUpdateVoucherMutation();

  useEffect(() => {
    if (isEdit && voucher) {
      setForm({
        code: voucher.code || '',
        usage_limit: voucher.usage_limit || 1,
        start_date: voucher.start_date ? voucher.start_date.slice(0, 10) : '',
        end_date: voucher.end_date ? voucher.end_date.slice(0, 10) : '',
        is_free_shipping: !!voucher.is_free_shipping,
      });
    } else {
      setForm({
        code: '',
        usage_limit: 1,
        start_date: '',
        end_date: '',
        is_free_shipping: true,
      });
    }
    setFormError('');
    setTouched({});
  }, [open, isEdit, voucher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    if (!form.code.trim()) return 'Mã voucher không được để trống';
    if (!form.usage_limit || isNaN(form.usage_limit) || form.usage_limit < 1) return 'Giới hạn lượt phải lớn hơn 0';
    if (!form.start_date) return 'Vui lòng chọn ngày bắt đầu';
    if (!form.end_date) return 'Vui lòng chọn ngày kết thúc';
    if (form.end_date < form.start_date) return 'Ngày kết thúc phải sau ngày bắt đầu';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateVoucher({ id: voucher.id, ...form }).unwrap();
        toast.success('Cập nhật voucher thành công');
      } else {
        await createVoucher(form).unwrap();
        toast.success('Tạo voucher thành công');
      }
      onSuccess && onSuccess();
    } catch (error) {
      setFormError(error.data?.message || 'Có lỗi xảy ra');
      toast.error(error.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit} className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{isEdit ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}</h3>
            {formError && (
              <div className="mb-2 p-2 bg-red-50 border-l-4 border-red-400 text-red-700">
                <p className="text-sm">{formError}</p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Mã voucher <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm font-mono"
                placeholder="Nhập mã voucher"
                disabled={isEdit}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Giới hạn lượt <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="usage_limit"
                value={form.usage_limit}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                min={1}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Ngày kết thúc <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="is_free_shipping"
                checked={form.is_free_shipping}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                id="is_free_shipping"
              />
              <label htmlFor="is_free_shipping" className="ml-2 block text-sm text-gray-700">Miễn phí vận chuyển</label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormVoucher;