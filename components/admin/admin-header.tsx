import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="bg-jefferson-deep-blue border-b border-jefferson-bright-blue/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/jefferson-logo.png"
              alt="Thomas Jefferson University"
              width={50}
              height={50}
              className="rounded"
            />
            <div>
              <h1 className="text-xl font-serif font-bold text-white">Admin Configuration Panel</h1>
              <p className="text-jefferson-bright-blue text-sm">System Configuration • Equipment Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-jefferson-bright-blue text-jefferson-bright-blue hover:bg-jefferson-bright-blue hover:text-jefferson-deep-blue"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
