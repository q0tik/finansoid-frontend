import { ref, onMounted, onBeforeUnmount } from "vue";

export function useIsMobile(query = "(max-width: 768px)") {
    const isMobile = ref(false);
    let mql;

    const update = () => {
        isMobile.value = mql.matches;
    };

    onMounted(() => {
        mql = window.matchMedia(query);
        update();
        mql.addEventListener?.("change", update);
        // для старых Safari:
        mql.addListener?.(update);
    });

    onBeforeUnmount(() => {
        mql.removeEventListener?.("change", update);
        mql.removeListener?.(update);
    });

    return { isMobile };
}
