import hooks from "../../data/premium/hooks/food.json";

export default function PremiumLibrary() {
  return (
    <main className="max-w-6xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-2">
        Premium Hook Library
      </h1>

      <p className="text-gray-500 mb-8">
        Hook คุณภาพสูงสำหรับ Creator OS
      </p>

      <div className="grid gap-5">

        {hooks.map((item:any)=>(
          <div
            key={item.id}
            className="rounded-2xl border p-5 shadow-sm bg-white"
          >

            <div className="flex justify-between">

              <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                {item.industry}
              </span>

              <span className="text-xs text-gray-400">
                ⭐ {item.premiumScore}
              </span>

            </div>

            <h2 className="text-2xl font-bold mt-4">
              {item.hook}
            </h2>

            <p className="text-gray-500 mt-3">
              {item.example}
            </p>

            <div className="flex gap-2 mt-4 flex-wrap">

              {item.tags.map((tag:string)=>(
                <span
                  key={tag}
                  className="text-sm bg-gray-100 rounded-full px-3 py-1"
                >
                  #{tag}
                </span>
              ))}

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}