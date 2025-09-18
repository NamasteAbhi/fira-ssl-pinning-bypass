/**
 * Configurable variables
 */
const MODULE_NAME   = "libconnection.so";
const SCAN_PATTERN  = "A8 C6 0A 94 00 03 00 F9";
const PATCH_BYTES   = [
    "nop",           // replace with no-op
    "nop",           // replace with no-op
    0x52800060,      // mov w0, #3
    "nop"            // replace with no-op
];

/**
 * Utility: Wait until a module is loaded.
 */
function waitForModule(name) {
    return new Promise(resolve => {
        const timer = setInterval(() => {
            const mod = Process.findModuleByName(name);
            if (mod) {
                clearInterval(timer);
                resolve(mod);
            }
        }, 0);
    });
}

/**
 * Apply the patch if device is arm64
 */

async function main() {
    if (Process.arch !== "arm64") {
        console.log(`[!] Skipping patch: unsupported arch (${Process.arch})`);
        return;
    }

    const mod = await waitForModule(MODULE_NAME);
    console.log(`[*] Loaded ${MODULE_NAME} @ ${mod.base}`);

    Memory.scan(mod.base, mod.size, SCAN_PATTERN, {
        onMatch(address) {
            console.log(`[*] Pattern found at ${address} (offset: ${address.sub(mod.base)})`);

            Memory.patchCode(address, Process.pageSize, code => {
                const writer = new Arm64Writer(code, { pc: address });

                for (const insn of PATCH_BYTES) {
                    if (insn === "nop") {
                        writer.putNop();
                    } else {
                        writer.putInstruction(insn);
                    }
                }

                writer.flush();
            });

            console.log("[*] Patch applied successfully");
            return 'stop';
        },
        onError(reason) {
            console.error(`[!] Scan error: ${reason}`);
        }
    });
}

main().catch(err => console.error(`[!] Script error: ${err}`));
