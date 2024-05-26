import PropTypes from "prop-types";
const ErrorModal = (props) => {
  const closeModal = () => {
    document.getElementById("my-modal").classList.add("hidden");
    props.onClear();
    props.onClose();

  };
  return (
    <div>
      <div className="fixed z-10 inset-0 overflow-y-auto" id="my-modal">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <i className="fa-solid fa-circle-exclamation fa-xl"></i>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Error
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{props.error}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                onClick={closeModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorModal.propTypes = {
  error: PropTypes.string, // Ensure that 'error' prop is a required string
  onClear: PropTypes.func, // Ensure that 'onClear' prop is a required function
  onClose: PropTypes.func, // Ensure that 'onClose' prop is a required function
};

export default ErrorModal;
