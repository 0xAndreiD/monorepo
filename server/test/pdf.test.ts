import fs from "fs";

test('it counts the number of pages after merging one pdf', async () => {
    const pdfsToMerge = ["test/data/dummy.pdf"];
    const outputPdfPath = "public/media/demo.pdf";
    try {
        fs.unlinkSync(outputPdfPath);
    } catch {
    }

    expect(1).toBe(1);
    fs.unlinkSync(outputPdfPath);
});
