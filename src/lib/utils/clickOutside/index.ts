type Args = {
  enabled: boolean;
  cb: () => void;
};
export default function clickOutside(
  node: HTMLElement,
  { enabled: initialEnabled, cb }: Args
) {
  //@ts-ignore
  const handleOutsideClick = ({ target }) => {
    if (!node.contains(target)) {
      cb();
    }
  };
  //@ts-ignore
  function update({ enabled }) {
    if (enabled) {
      window.addEventListener("click", handleOutsideClick);
    } else {
      window.removeEventListener("click", handleOutsideClick);
    }
  }

  update({ enabled: initialEnabled });
  return {
    update,
    destroy() {
      window.removeEventListener("click", handleOutsideClick);
    },
  };
}
